import { useState } from 'react';
import PageWrapper from '../components/pageWrapper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios, { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';

const CrateBlogPage = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // const navigate = useNavigate();

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

  const handleSubmit = async (isPublished: boolean) => {
    const payload = {
      title,
      content,
      description,
      categories: selectedCategories,
      image,
      isPublished,
    };

    try {
      console.log(payload);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/blogs/post`,
        payload
      );

      if (response.status.toString().startsWith('2')) {
        // return navigate(`/${response.data.slug}`);
        console.log(response.data);
        toast.success(response.data.message);
      }

      throw new Error('Failed to submit blog');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Error submitting blog:', error);
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
      <ToastContainer />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-bold text-[#2c586a] mb-6">
          Create Blog Post
        </h1>

        {/* Title Input */}
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter blog title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Upload Cover Image</label>
          <div className="flex items-center gap-4">
            <input type="file" accept="image/*" onChange={handleImageUpload} />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Choose categories:</label>
              <div className="grid grid-cols-2 gap-2">
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
          {image && (
            <img
              src={image}
              alt="Blog Cover"
              className="mt-4 w-full rounded-lg shadow-md"
            />
          )}
        </div>

        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          placeholder="Enter blog description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Rich Text Editor */}
        <ReactQuill
          value={content}
          onChange={setContent}
          className="mb-5"
          modules={modules}
        />

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            className="bg-[#2c586a] text-sm text-white font-medium py-3 px-6 rounded-lg hover:bg-[#1e4050]"
            onClick={() => handleSubmit(true)}
          >
            Publish Blog
          </button>
          <button
            className="bg-gray-400 text-sm text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-500"
            onClick={() => handleSubmit(false)}
          >
            Save as draft / Preview
          </button>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CrateBlogPage;
