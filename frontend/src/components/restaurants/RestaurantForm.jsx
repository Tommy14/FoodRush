import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DashSidebar from '../../components/DashSidebar';
import { FaCamera, FaUpload, FaSpinner, FaPlusCircle, FaTimes } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { getRestaurantById } from '../../services/restaurantService';

// Update input styles with light green theme
const inputClasses = "w-full px-3 py-2 border rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500";

const RestaurantForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cuisineInput, setCuisineInput] = useState('');
  
  const [formData, setFormData] = useState({
    restaurantId: uuidv4(),
    name: '',
    description: '',
    cuisineTypes: [],
    priceRange: '$$',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Sri Lanka'
    },
    contactPhone: '',
    contactEmail: '',
    openingHours: {
      monday: { open: '08:00', close: '22:00', isClosed: false },
      tuesday: { open: '08:00', close: '22:00', isClosed: false },
      wednesday: { open: '08:00', close: '22:00', isClosed: false },
      thursday: { open: '08:00', close: '22:00', isClosed: false },
      friday: { open: '08:00', close: '22:00', isClosed: false },
      saturday: { open: '08:00', close: '22:00', isClosed: false },
      sunday: { open: '08:00', close: '22:00', isClosed: false }
    }
  });
  
  const [files, setFiles] = useState({
    logo: null,
    coverImage: null
  });
  
  const [previews, setPreviews] = useState({
    logo: '',
    coverImage: ''
  });

  const availableCuisineTypes = [
    'All', 'Grocery', 'Breakfast', 'Drinks', 'Chinese', 'Pizza', 
    'Burger', 'Sri Lankan', 'Dessert', 'Vegan', 'Fish', 'BBQ', 'Healthy', 'Bakery'
  ];

  const addPredefinedCuisine = (cuisine) => {
    if (!formData.cuisineTypes.includes(cuisine)) {
      setFormData(prev => ({
        ...prev,
        cuisineTypes: [...prev.cuisineTypes, cuisine]
      }));
    }
  };

  // Fetch restaurant data if in edit mode
  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (isEditMode && auth.token) {
        try {
          setFetchLoading(true);
          const restaurant = await getRestaurantById(id, auth.token);
          
          // Handle cuisine types
          let cuisineTypes = [];
          if (typeof restaurant.cuisineTypes === 'string') {
            cuisineTypes = restaurant.cuisineTypes.split(',').map(type => type.trim());
          } else if (Array.isArray(restaurant.cuisineTypes)) {
            cuisineTypes = restaurant.cuisineTypes;
          }
          
          // Create default opening hours outside of the effect dependency
          const defaultOpeningHours = {
            monday: { open: '08:00', close: '22:00', isClosed: false },
            tuesday: { open: '08:00', close: '22:00', isClosed: false },
            wednesday: { open: '08:00', close: '22:00', isClosed: false },
            thursday: { open: '08:00', close: '22:00', isClosed: false },
            friday: { open: '08:00', close: '22:00', isClosed: false },
            saturday: { open: '08:00', close: '22:00', isClosed: false },
            sunday: { open: '08:00', close: '22:00', isClosed: false }
          };
          
          // Handle opening hours
          let openingHours = { ...defaultOpeningHours };
          if (restaurant.openingHours) {
            if (typeof restaurant.openingHours === 'string') {
              try {
                openingHours = JSON.parse(restaurant.openingHours);
              } catch (error) {
                console.error("Failed to parse opening hours:", error);
              }
            } else if (typeof restaurant.openingHours === 'object') {
              openingHours = restaurant.openingHours;
            }
          }
          
          // Update form data with fetched restaurant data
          setFormData({
            restaurantId: restaurant._id || uuidv4(),
            name: restaurant.name || '',
            description: restaurant.description || '',
            cuisineTypes: cuisineTypes,
            priceRange: restaurant.priceRange || '$$',
            address: {
              street: restaurant.address?.street || '',
              city: restaurant.address?.city || '',
              state: restaurant.address?.state || '',
              postalCode: restaurant.address?.postalCode || '',
              country: restaurant.address?.country || 'Sri Lanka'
            },
            contactPhone: restaurant.contactPhone || '',
            contactEmail: restaurant.contactEmail || '',
            openingHours: openingHours
          });
          
          // Handle image URLs with fallbacks for different API response formats
          if (restaurant.logoUrl || restaurant.logo) {
            setPreviews(prev => ({ ...prev, logo: restaurant.logoUrl || restaurant.logo }));
          }
          
          if (restaurant.coverImageUrl || restaurant.coverImage) {
            setPreviews(prev => ({ ...prev, coverImage: restaurant.coverImageUrl || restaurant.coverImage }));
          }
          
        } catch (err) {
          setError('Failed to load restaurant data. Please try again.');
        } finally {
          setFetchLoading(false);
        }
      }
    };
    
    fetchRestaurantData();
  }, [id, auth.token, isEditMode]);
  
  // Functions for handling cuisine types
  const addCuisineType = () => {
    if (cuisineInput.trim() && !formData.cuisineTypes.includes(cuisineInput.trim())) {
      setFormData(prev => ({
        ...prev,
        cuisineTypes: [...prev.cuisineTypes, cuisineInput.trim()]
      }));
      setCuisineInput('');
    }
  };
  
  const removeCuisineType = (indexOrValue) => {
    if (typeof indexOrValue === 'number') {
      // Remove by index
      setFormData(prev => ({
        ...prev,
        cuisineTypes: prev.cuisineTypes.filter((_, i) => i !== indexOrValue)
      }));
    } else {
      // Remove by value
      setFormData(prev => ({
        ...prev,
        cuisineTypes: prev.cuisineTypes.filter(type => type !== indexOrValue)
      }));
    }
  };
  
  const handleCuisineKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCuisineType();
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };
  
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    
    // For single file (logo or coverImage)
    setFiles(prev => ({
      ...prev,
      [name]: selectedFiles[0]
    }));
    
    // Create preview
    if (selectedFiles[0]) {
      setPreviews(prev => ({
        ...prev,
        [name]: URL.createObjectURL(selectedFiles[0])
      }));
    }
  };
  
  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.cuisineTypes.length > 0 &&
      formData.contactPhone.trim() !== '' &&
      formData.address.street.trim() !== '' &&
      formData.address.city.trim() !== '' &&
      formData.address.state.trim() !== '' &&
      formData.address.postalCode.trim() !== ''
    );
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setError('Please fill in all required fields including at least one cuisine type');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const restaurantFormData = new FormData();
      
      // Add the ID fields first
      if (isEditMode) {
        restaurantFormData.append('_id', id);
      }
      restaurantFormData.append('restaurantId', formData.restaurantId);
      
      // Add basic fields
      restaurantFormData.append('name', formData.name);
      restaurantFormData.append('description', formData.description);
      restaurantFormData.append('priceRange', formData.priceRange);
      restaurantFormData.append('contactPhone', formData.contactPhone);
      
      if (formData.contactEmail) {
        restaurantFormData.append('contactEmail', formData.contactEmail);
      }
      
      // Add cuisineTypes as individual fields
      formData.cuisineTypes.forEach(type => {
        restaurantFormData.append('cuisineTypes', type);
      });
      
      // Append each address field individually
      restaurantFormData.append('address.street', formData.address.street);
      restaurantFormData.append('address.city', formData.address.city);
      restaurantFormData.append('address.state', formData.address.state);
      restaurantFormData.append('address.postalCode', formData.address.postalCode);
      restaurantFormData.append('address.country', formData.address.country || 'Sri Lanka');
      
      // Add opening hours
      restaurantFormData.append('openingHours', JSON.stringify(formData.openingHours));
      
      // Add files if they exist
      if (files.logo) {
        restaurantFormData.append('logo', files.logo);
      }
      
      if (files.coverImage) {
        restaurantFormData.append('coverImage', files.coverImage);
      }
      
      // Use the API_BASE from the restaurantService
      const API_BASE = 'http://localhost:5001/bff/restaurants';
      const apiUrl = isEditMode ? `${API_BASE}/${id}` : API_BASE;
      
      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url: apiUrl,
        data: restaurantFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      setSuccess(`Restaurant ${isEditMode ? 'updated' : 'created'} successfully! Redirecting to management page...`);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/manage-restaurants');
      }, 2000);
    } catch (err) {
      let errorMessage = 'Failed to save restaurant. Please try again.';
      
      if (err.response) {
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <DashSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-green-600 text-4xl mx-auto mb-4" />
            <p className="text-gray-600">Loading restaurant data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashSidebar />

      <div className="flex-1 p-8 pt-20 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-800">
          {isEditMode ? 'Update Restaurant' : 'Create New Restaurant'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-700">Basic Information</h2>

              {/* Hidden field */}
              <input
                type="hidden"
                name="restaurantId"
                value={formData.restaurantId}
              />

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={inputClasses}
                  rows="3"
                  required
                />
              </div>

              {/* Cuisine Types - Tag Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Cuisine Types *
                </label>
                
                {/* Selected cuisines */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.cuisineTypes.map((type, index) => (
                    <div
                      key={index}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center"
                    >
                      <span>{type}</span>
                      <button
                        type="button"
                        onClick={() => removeCuisineType(index)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Available cuisine tags */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Select cuisine types:</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {availableCuisineTypes.map(cuisine => (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => addPredefinedCuisine(cuisine)}
                        disabled={formData.cuisineTypes.includes(cuisine)}
                        className={`px-2.5 py-1 rounded-full text-sm transition-all ${
                          formData.cuisineTypes.includes(cuisine) 
                            ? 'bg-green-200 text-green-800 opacity-60 cursor-not-allowed' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom cuisine input */}
                  <div className="flex">
                    <input
                      type="text"
                      value={cuisineInput}
                      onChange={(e) => setCuisineInput(e.target.value)}
                      onKeyPress={handleCuisineKeyPress}
                      placeholder="Add custom cuisine type..."
                      className="w-full px-3 py-2 border rounded-l-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500"
                    />
                    <button
                      type="button"
                      onClick={addCuisineType}
                      className="px-3 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                    >
                      <FaPlusCircle />
                    </button>
                  </div>
                </div>
                
                {formData.cuisineTypes.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    At least one cuisine type is required
                  </p>
                )}
              </div>

            </div>

            {/* Contact & Address */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-green-700">Contact & Address</h2>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className={inputClasses}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Province/State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.address.postalCode}
                    onChange={handleAddressChange}
                    className={inputClasses}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Price Range</label>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  className={inputClasses}
                >
                  <option value="$">$ (Budget)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Expensive)</option>
                  <option value="$$$$">$$$$ (Very Expensive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Restaurant Images */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Restaurant Images</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Restaurant Logo
                </label>
                <div className="border-2 border-dashed border-green-200 rounded-lg p-4 text-center hover:border-green-400 transition duration-300">
                  {previews.logo ? (
                    <div className="mb-2">
                      <img
                        src={previews.logo}
                        alt="Logo Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-full border-2 border-green-200"
                      />
                    </div>
                  ) : (
                    <div className="text-green-500 flex items-center justify-center h-32">
                      <FaCamera className="text-3xl" />
                    </div>
                  )}

                  <input
                    type="file"
                    name="logo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="mt-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition duration-200"
                  >
                    <FaUpload className="mr-2" />{" "}
                    {previews.logo ? "Change Logo" : "Upload Logo"}
                  </label>
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-green-200 rounded-lg p-4 text-center hover:border-green-400 transition duration-300">
                  {previews.coverImage ? (
                    <div className="mb-2">
                      <img
                        src={previews.coverImage}
                        alt="Cover Preview"
                        className="mx-auto h-32 w-full object-cover rounded-md border-2 border-green-200"
                      />
                    </div>
                  ) : (
                    <div className="text-green-500 flex items-center justify-center h-32">
                      <FaCamera className="text-3xl" />
                    </div>
                  )}

                  <input
                    type="file"
                    name="coverImage"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="mt-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition duration-200"
                  >
                    <FaUpload className="mr-2" />{" "}
                    {previews.coverImage ? "Change Cover" : "Upload Cover"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Opening Hours</h2>

            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(formData.openingHours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex flex-col md:flex-row md:items-center p-2 rounded hover:bg-green-100 transition"
                  >
                    <div className="w-full md:w-1/5 font-medium capitalize mb-2 md:mb-0 text-green-800">
                      {day}
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-4/5">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hours.isClosed}
                          onChange={() => {
                            setFormData((prev) => ({
                              ...prev,
                              openingHours: {
                                ...prev.openingHours,
                                [day]: {
                                  ...prev.openingHours[day],
                                  isClosed: !hours.isClosed,
                                },
                              },
                            }));
                          }}
                          className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Closed
                        </span>
                      </label>

                      {!hours.isClosed && (
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 flex items-center">
                            <span className="text-sm text-gray-600 mr-2">
                              Open:
                            </span>
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  openingHours: {
                                    ...prev.openingHours,
                                    [day]: {
                                      ...prev.openingHours[day],
                                      open: e.target.value,
                                    },
                                  },
                                }));
                              }}
                              className="flex-1 px-2 py-1 border rounded text-sm bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>

                          <div className="flex-1 flex items-center">
                            <span className="text-sm text-gray-600 mr-2">
                              Close:
                            </span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  openingHours: {
                                    ...prev.openingHours,
                                    [day]: {
                                      ...prev.openingHours[day],
                                      close: e.target.value,
                                    },
                                  },
                                }));
                              }}
                              className="flex-1 px-2 py-1 border rounded text-sm bg-green-50 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                          </div>
                        </div>
                      )}

                      {hours.isClosed && (
                        <div className="flex-1 ml-2 text-gray-500 italic text-sm">
                          Not open on this day
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-green-100 p-3 rounded-md">
                <div className="flex items-start">
                  <div className="text-green-800 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="ml-2 text-sm text-green-800">
                    Please use 24-hour format (e.g., 08:00 for 8 AM, 18:00 for 6
                    PM). Make sure closing time is after opening time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate('/manage-restaurants')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium transition duration-200 shadow-md hover:shadow-lg"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <FaSpinner className="inline animate-spin mr-2" />
                  {isEditMode ? 'Updating Restaurant...' : 'Creating Restaurant...'}
                </>
              ) : (
                isEditMode ? 'Update Restaurant' : 'Create Restaurant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantForm;