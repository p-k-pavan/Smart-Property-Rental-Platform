import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaBed, FaBath, FaWifi, FaCar, FaShieldAlt, FaPowerOff, FaShareAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { FaElevator } from 'react-icons/fa6';
import { IoLocationSharp } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { BiArea } from 'react-icons/bi';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (window.confirm('Are you sure you want to delete this property?')) {
        await axios.delete(`http://localhost:5000/api/properties/${id}`, {
          headers: {
          "Content-Type": "application/json",
          "owner-id": currentUser._id
        },
        withCredentials: true
        });
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete property');
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: true,
    cssEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="text-gray-600">Loading property details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md w-full shadow-lg rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading property</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!property) return null;

  const {
    title,
    price,
    location,
    description,
    amenities = [],
    images = [],
    createdAt,
    propertyType,
    bedrooms,
    bathrooms,
    elevator,
    sqfeet,
    availableFrom,
    bookingStatus,
    ownerId
  } = property.data || {};

  const isOwner = currentUser && currentUser._id === ownerId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
            <MdVerified className="text-blue-500 text-xl" />
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {propertyType}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <IoLocationSharp className="text-blue-600" />
            <span>{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">₹{price?.toLocaleString()}</span>
              <span className="text-sm font-light">/month</span>
            </div>
          </div>
          <div className="flex gap-2">
            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/property/edit/${id}`)}
                  className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200"
                  title="Edit Property"
                >
                  <FaEdit className="text-blue-600" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200"
                  title="Delete Property"
                >
                  <FaTrash className="text-red-600" />
                </button>
              </>
            )}

            <button
              className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200"
              title="Share property"
            >
              <FaShareAlt className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-xl overflow-hidden shadow-xl relative">
        {images.length > 0 ? (
          <Slider {...sliderSettings}>
            {images.map((img, index) => (
              <div key={index} className="relative h-[500px] w-full">
                <img
                  src={img?.trim()}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"}
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="h-[500px] bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-lg">No images available</span>
          </div>
        )}
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full shadow-md text-sm font-medium">
          {images.length} Photos
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">

        <div className="space-y-8">

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Property Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyType !== 'Plot' && (
                <>
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                    <FaBed className="text-blue-600 text-2xl mb-2" />
                    <span className="font-bold text-gray-900">{bedrooms}</span>
                    <span className="text-sm text-gray-600">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                    <FaBath className="text-blue-600 text-2xl mb-2" />
                    <span className="font-bold text-gray-900">{bathrooms}</span>
                    <span className="text-sm text-gray-600">Bathrooms</span>
                  </div>
                </>
              )}
              <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                <BiArea className="text-blue-600 text-2xl mb-2" />
                <span className="font-bold text-gray-900">{sqfeet}</span>
                <span className="text-sm text-gray-600">Sq. Ft.</span>
              </div>
              {propertyType !== 'Plot' && (
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <FaElevator className="text-blue-600 text-2xl mb-2" />
                  <span className="font-bold text-gray-900">{elevator ? 'Yes' : 'No'}</span>
                  <span className="text-sm text-gray-600">Elevator</span>
                </div>
              )}
            </div>
          </div>


          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
          </div>


          {amenities.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition duration-200">
                    <div className="mr-3 p-2 bg-white rounded-full shadow-sm">
                      {amenity === 'WiFi' && <FaWifi className="text-blue-600" />}
                      {amenity === 'Power Backup' && <FaPowerOff className="text-blue-600" />}
                      {amenity === 'Parking' && <FaCar className="text-blue-600" />}
                      {amenity === 'Lift' && <FaElevator className="text-blue-600" />}
                      {amenity === 'Security' && <FaShieldAlt className="text-blue-600" />}
                    </div>
                    <span className="font-medium text-gray-800">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="lg:sticky lg:top-6 space-y-6">

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {isOwner ? 'Contact Requests' : 'Schedule a Visit'}
              </h3>
              {isOwner ? (
                <div className="text-center py-4 text-gray-500">
                  Owner view - contact requests would appear here
                </div>
              ) : (
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Your Email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      placeholder="Your Message"
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md"
                  >
                    Request Information
                  </button>
                </form>
              )}
              <div className="mt-4 text-center text-sm text-gray-500">
                {isOwner ? 'You will be notified when someone contacts you' : 'We\'ll contact you within 24 hours'}
              </div>
            </div>


            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posted on:</span>
                  <span className="font-medium">{new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${bookingStatus ? 'text-red-600' : 'text-green-600'}`}>
                    {bookingStatus ? 'Booked' : 'Available'}
                  </span>
                </div>
                {availableFrom && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available From:</span>
                    <span className="font-medium">
                      {new Date(availableFrom).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;