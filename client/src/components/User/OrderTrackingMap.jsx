import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export default function OrderTrackingMap({ order, rider, customerLocation }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routePolylineRef = useRef(null);
  
  // Initialize map when component mounts
  useEffect(() => {
    initMap();
    
    // Cleanup function
    return () => {
      if (markersRef.current) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
      
      if (routePolylineRef.current) {
        routePolylineRef.current.setMap(null);
      }
    };
  }, []);
  
  // Update map when rider or order changes
  useEffect(() => {
    if (mapInstanceRef.current && (rider || order)) {
      updateMap();
    }
  }, [rider, order]);
  
  const initMap = () => {
    // Check if we're running in a browser environment with window object
    if (typeof window === 'undefined' || !window.google) {
      setError('Google Maps API not loaded. Using fallback visualization.');
      setLoading(false);
      return;
    }
    
    try {
      // Create map instance
      const mapOptions = {
        zoom: 13,
        center: customerLocation || { lat: 40.7128, lng: -74.0060 }, // Default to NYC if no location
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;
      
      setLoading(false);
      
      if (rider || order) {
        updateMap();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map. Using fallback visualization.');
      setLoading(false);
    }
  };
  
  const updateMap = () => {
    clearMapObjects();
    
    try {
      if (!window.google || !mapInstanceRef.current) {
        return;
      }
      
      const bounds = new window.google.maps.LatLngBounds();
      
      // Add marker for store location (starting point)
      const storeLocation = { lat: 40.7128, lng: -74.0060 }; // Default store location
      const storeMarker = new window.google.maps.Marker({
        position: storeLocation,
        map: mapInstanceRef.current,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          scaledSize: new window.google.maps.Size(32, 32)
        },
        title: 'Store'
      });
      
      markersRef.current.push(storeMarker);
      bounds.extend(storeLocation);
      
      // Add marker for customer location (destination)
      if (customerLocation) {
        const customerMarker = new window.google.maps.Marker({
          position: customerLocation,
          map: mapInstanceRef.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          },
          title: 'Delivery Location'
        });
        
        markersRef.current.push(customerMarker);
        bounds.extend(customerLocation);
        
        // Add info window for customer marker
        const customerInfoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>Delivery Address</strong><br/>${order.customerInfo?.address || 'Your delivery location'}</div>`
        });
        
        customerMarker.addListener('click', () => {
          customerInfoWindow.open(mapInstanceRef.current, customerMarker);
        });
      }
      
      // Add marker for rider location if available
      if (rider && rider.location) {
        const riderMarker = new window.google.maps.Marker({
          position: rider.location,
          map: mapInstanceRef.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/motorcycling.png',
            scaledSize: new window.google.maps.Size(32, 32)
          },
          title: 'Rider',
          // Add animation for rider marker
          animation: window.google.maps.Animation.BOUNCE
        });
        
        markersRef.current.push(riderMarker);
        bounds.extend(rider.location);
        
        // Add info window for rider marker
        const riderInfoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${rider.name}</strong><br/>Your delivery rider</div>`
        });
        
        riderMarker.addListener('click', () => {
          riderInfoWindow.open(mapInstanceRef.current, riderMarker);
        });
        
        // Draw route between rider and customer
        if (order.status === 'Shipped') {
          drawRoute(rider.location, customerLocation);
        }
      }
      
      // Fit map to bounds
      mapInstanceRef.current.fitBounds(bounds);
      
      // Adjust zoom if too close
      const zoomListener = window.google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
        if (mapInstanceRef.current.getZoom() > 16) {
          mapInstanceRef.current.setZoom(16);
        }
        window.google.maps.event.removeListener(zoomListener);
      });
    } catch (error) {
      console.error('Error updating map:', error);
      toast.error('Failed to update map');
    }
  };
  
  const drawRoute = (origin, destination) => {
    if (!window.google || !mapInstanceRef.current) {
      return;
    }
    
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: true, // We already have our custom markers
        polylineOptions: {
          strokeColor: '#4285F4',
          strokeWeight: 5,
          strokeOpacity: 0.8
        }
      });
      
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (response, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
            routePolylineRef.current = directionsRenderer;
            
            // Calculate ETA
            const route = response.routes[0];
            if (route && route.legs.length > 0) {
              const leg = route.legs[0];
              const duration = leg.duration.text;
              const distance = leg.distance.text;
              
              // Display ETA information
              const etaInfo = document.getElementById('eta-info');
              if (etaInfo) {
                etaInfo.innerHTML = `<strong>ETA:</strong> ${duration} (${distance})`;
              }
            }
          } else {
            console.error('Directions request failed due to', status);
            // Fall back to straight line
            drawStraightLine(origin, destination);
          }
        }
      );
    } catch (error) {
      console.error('Error drawing route:', error);
      // Fall back to straight line
      drawStraightLine(origin, destination);
    }
  };
  
  const drawStraightLine = (origin, destination) => {
    if (!window.google || !mapInstanceRef.current) {
      return;
    }
    
    try {
      const polyline = new window.google.maps.Polyline({
        path: [origin, destination],
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: mapInstanceRef.current
      });
      
      routePolylineRef.current = polyline;
    } catch (error) {
      console.error('Error drawing straight line:', error);
    }
  };
  
  const clearMapObjects = () => {
    // Clear markers
    if (markersRef.current) {
      markersRef.current.forEach(marker => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = [];
    }
    
    // Clear route polyline
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
  };
  
  // Fallback visualization when Google Maps is not available
  const renderFallbackVisualization = () => {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="font-medium text-gray-800 mb-1">Delivery in Progress</h3>
        <p className="text-sm text-gray-600 mb-2">
          {order.status === 'Shipped' 
            ? 'Your order is on the way!' 
            : order.status === 'Delivered'
              ? 'Your order has been delivered!'
              : 'Your order is being prepared.'}
        </p>
        
        {order.status === 'Shipped' && rider && (
          <div className="mt-4 bg-blue-50 p-3 rounded-lg text-left">
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Estimated Delivery Time</p>
                <p className="text-xs text-gray-600">30-45 minutes</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Delivery Address</p>
                <p className="text-xs text-gray-600">{order.customerInfo?.address || 'Your delivery address'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        {/* Map container */}
        <div 
          ref={mapRef} 
          className="w-full h-64 bg-gray-100"
          style={{ display: error ? 'none' : 'block' }}
        ></div>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="p-4">
            {renderFallbackVisualization()}
          </div>
        )}
        
        {/* ETA information */}
        <div id="eta-info" className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-3 py-1 rounded-lg text-sm"></div>
      </div>
    </div>
  );
}
