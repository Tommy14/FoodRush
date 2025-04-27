import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import DashSidebar from '../../components/DashSidebar';
import { FaCamera, FaUpload, FaSpinner, FaPlusCircle, FaTimes } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

// Update input styles to have light green background and green focus
const inputClasses = "w-full px-3 py-2 border rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-500";
const buttonClasses = "px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200";
const secondaryButtonClasses = "px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition duration-200";

const CreateRestaurant = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
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
    coverImage: null,
    images: []
  });
  
  const [previews, setPreviews] = useState({
    logo: '',
    coverImage: '',
    images: []
  });
  
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
  
  const removeCuisineType = (index) => {
    setFormData(prev => ({
      ...prev,
      cuisineTypes: prev.cuisineTypes.filter((_, i) => i !== index)
    }));
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
    
    if (name === 'images') {
      // For multiple images
      const newImages = Array.from(selectedFiles);
      setFiles(prev => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 10) // Limit to 10 images
      }));
      
      // Create previews
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setPreviews(prev => ({
        ...prev,
        images: [...prev.images, ...newPreviews].slice(0, 10)
      }));
    } else {
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
    }
  };
  
  const removeImage = (index) => {
    setFiles(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    setPreviews(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
      
      // Add restaurantId first to ensure it's not null
      restaurantFormData.append('restaurantId', formData.restaurantId);
      
      // Add basic fields
      restaurantFormData.append('name', formData.name);
      restaurantFormData.append('description', formData.description);
      restaurantFormData.append('priceRange', formData.priceRange);
      restaurantFormData.append('contactPhone', formData.contactPhone);
      
      // Only add email if it exists
      if (formData.contactEmail) {
        restaurantFormData.append('contactEmail', formData.contactEmail);
      }
      
      // Add cuisineTypes as multiple values
      formData.cuisineTypes.forEach(type => {
        restaurantFormData.append('cuisineTypes', type);
      });
      
      // Add objects as JSON strings
      restaurantFormData.append('address', JSON.stringify(formData.address));
      restaurantFormData.append('openingHours', JSON.stringify(formData.openingHours));
      
      // Add files if they exist
      if (files.logo) {
        restaurantFormData.append('logo', files.logo);
      }
      
      if (files.coverImage) {
        restaurantFormData.append('coverImage', files.coverImage);
      }
      
      if (files.images.length > 0) {
        files.images.forEach(image => {
          restaurantFormData.append('images', image);
        });
      }
      
      console.log('Submitting restaurant data with ID:', formData.restaurantId);
      
      const response = await axios.post('/bff/restaurants', restaurantFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${auth.token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      });
      
      console.log('Restaurant created:', response.data);
      
      setSuccess('Restaurant created successfully! Redirecting to management page...');
      setTimeout(() => {
        navigate('/manage-restaurants');
      }, 2000);
    } catch (err) {
      console.error('Error creating restaurant:', err);
      
      // Improved error handling
      let errorMessage = 'Failed to create restaurant. Please try again.';
      
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
        
        errorMessage = err.response.data.message || errorMessage;
        
        // If we have more detailed error information
        if (err.response.data.details) {
          console.error('Error details:', err.response.data.details);
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashSidebar />

      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Create New Restaurant</h1>

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

              {/* Cuisine Types - Multiple Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Cuisine Types *
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
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
                <div className="flex">
                  <input
                    type="text"
                    value={cuisineInput}
                    onChange={(e) => setCuisineInput(e.target.value)}
                    onKeyPress={handleCuisineKeyPress}
                    placeholder="e.g., Italian, Chinese, Sri Lankan"
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
                {formData.cuisineTypes.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">
                    At least one cuisine type is required
                  </p>
                )}
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

            {/* Gallery Images */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">
                Gallery Images (up to 10)
              </label>
              <div className="border-2 border-dashed border-green-200 rounded-lg p-4 hover:border-green-400 transition duration-300">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {previews.images.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`Gallery ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md border border-green-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  {previews.images.length < 10 && (
                    <div className="flex items-center justify-center h-24 border rounded-md border-green-200 bg-green-50">
                      <input
                        type="file"
                        name="images"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="gallery-upload"
                        multiple
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="flex flex-col items-center text-center p-2 cursor-pointer"
                      >
                        <FaCamera className="text-green-500 text-2xl mb-1" />
                        <span className="text-sm text-green-600">Add Photo</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <input
                    type="file"
                    name="images"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="gallery-upload-btn"
                    multiple
                  />
                  <label
                    htmlFor="gallery-upload-btn"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition duration-200"
                  >
                    <FaUpload className="mr-2" /> Upload Gallery Images
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    {previews.images.length}/10 images uploaded
                  </p>
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
                        <div className="flex flex-1 items-center gap-2">
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
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <FaSpinner className="inline animate-spin mr-2" />
                  Creating Restaurant...
                </>
              ) : (
                "Create Restaurant"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRestaurant;