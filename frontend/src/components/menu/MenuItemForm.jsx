import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaUpload } from "react-icons/fa";

const MenuItemForm = ({
  restaurantId,
  menuItem,
  onSubmit,
  onCancel,
  isEditing = false,
  isRestaurantAdmin = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (menuItem && isEditing) {
      setFormData({
        name: menuItem.name || "",
        price: menuItem.price || "",
        category: menuItem.category || "",
        description: menuItem.description || "",
      });

      if (menuItem.image && menuItem.image.url) {
        setPreviewUrl(menuItem.image.url);
      }
    }
  }, [menuItem, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error("Name and price are required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);

    if (formData.category) {
      formDataToSend.append("category", formData.category);
    }

    if (formData.description) {
      formDataToSend.append("description", formData.description);
    }

    if (image) {
      formDataToSend.append("image", image);
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formDataToSend);
      toast.success(
        `Menu item ${isEditing ? "updated" : "added"} successfully`
      );

      // Redirect based on user role
      if (isRestaurantAdmin) {
        navigate(`/restaurants/${restaurantId}/menu`);
      } else {
        navigate(`/restaurants/${restaurantId}`);
      }
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "add"} menu item`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <button
          onClick={() =>
            isRestaurantAdmin
              ? navigate(`/restaurants/${restaurantId}/menu`)
              : navigate(`/restaurants/${restaurantId}`)
          }
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" />
          {isRestaurantAdmin ? "Back to Menu Management" : "Back to Restaurant"}
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-6">
        {isRestaurantAdmin ? "Admin: " : ""}
        {isEditing ? "Edit Menu Item" : "Add New Menu Item"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <div className="mt-1 flex items-center">
                <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <FaUpload className="inline mr-2" />
                  {image ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {previewUrl && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={
              onCancel ||
              (() =>
                isRestaurantAdmin
                  ? navigate(`/restaurants/${restaurantId}/menu`)
                  : navigate(`/restaurants/${restaurantId}`))
            }
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Item"
              : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;
