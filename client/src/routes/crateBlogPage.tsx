import { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../main';

const CreateBlogPage = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(['general']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories([...selectedCategories, value]);
    } else {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== value));
    }
  };

  const handleSubmit = async (isPublished) => {
    setIsSubmitting(true);

    const payload = {
      title,
      content,
      description,
      categories: selectedCategories,
      image,
      isPublished,
    };

    try {
      const response = await axios.post(`${API_URL}/blogs/post`, payload, {
        withCredentials: true,
      });

      if (response.status.toString().startsWith('2')) {
        toast.success(response.data.message);
        return navigate(`/blogs/${response.data.slug}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        toast.error(error.response.data.error || 'Something went wrong!');
      } else {
        toast.error('Something went wrong!');
      }
      console.error('Error submitting blog:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'link', 'blockquote', 'image'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { align: [] },
        { color: [] },
        { background: [] },
      ],
    ],
  };

  return (
    <PageWrapper>
      <div className="p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-[#2c586a] mb-6">
          Create Blog Post
        </h1>

        {/* Title Input */}
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 border border-gray-200 rounded-t-lg text-xl font-semibold outline-none"
            placeholder="Enter blog title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <span
            className={`absolute right-1 bottom-0 text-xs font-semibold ${
              title.length > 100
                ? 'text-red-700'
                : title.length >= 85
                ? 'text-yellow-600'
                : title.length >= 5
                ? 'text-green-600'
                : 'text-red-400'
            }`}
          >
            {title.length}/100
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-b-lg mb-4 outline-none"
            placeholder="Enter blog description to be displayed on card..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span
            className={`absolute right-1 bottom-4 text-xs font-semibold ${
              description.length > 200
                ? 'text-red-700'
                : description.length >= 180
                ? 'text-yellow-600'
                : description.length >= 50
                ? 'text-green-600'
                : 'text-red-400'
            }`}
          >
            {description.length}/200
          </span>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <div className="flex md:items-center gap-4 md:flex-row flex-col">
            <div className="flex flex-col flex-1">
              <label className="block text-gray-600 mb-2">
                Upload a Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {image && (
                <img
                  src={image}
                  alt="Blog Cover"
                  className="mt-4 w-1/5 rounded-lg shadow-md"
                />
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm font-medium">Choose categories:</label>
              <div className="flex flex-wrap md:grid grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  'General',
                  'Web Design',
                  'Development',
                  'Databases',
                  'SEO',
                  'Marketing',
                ].map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={category.toLowerCase()}
                      checked={selectedCategories.includes(
                        category.toLowerCase()
                      )}
                      onChange={handleCategoryChange}
                      className="w-4 h-4"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="relative mb-4">
          <div className="quill-toolbar">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              className="quill-editor"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className={`bg-[#2c586a] text-sm text-white font-medium py-3 px-6 rounded-lg ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#1e4050]'
            }`}
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Blog'}
          </button>

          <button
            className={`bg-gray-400 text-sm text-white font-medium py-3 px-6 rounded-lg ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-500'
            }`}
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save as draft / Preview'}
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CreateBlogPage;
