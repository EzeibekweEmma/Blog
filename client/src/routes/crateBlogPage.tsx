import { useState } from 'react'
import PageWrapper from '../components/pageWrapper'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'

const CrateBlogPage = () => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [image, setImage] = useState(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setImage(reader.result)
    };
  }

  const handleSubmit = async (isPublished) => {
    const payload = {
      title,
      content,
      image,
      isPublished
    };
    console.log('Payload:', payload)
    try {
      const response = await axios.post('your-backend-api-url', payload)
      console.log('Response:', response.data)
    } catch (error) {
      console.error('Error submitting blog:', error)
    }
  }

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'link', 'blockquote', 'image'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { align: [] },
        { color: [] },
        { background: [] }
      ],
    ]
  };

  return (
    <PageWrapper>
      <div className='max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10'>
        <h1 className='text-3xl font-bold text-[#2c586a] mb-6'>
          Create Blog Post
        </h1>

        {/* Title Input */}
        <input
          type='text'
          className='w-full p-3 border border-gray-300 rounded-lg mb-4'
          placeholder='Enter blog title...'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Image Upload */}
        <div className='mb-4'>
          <label className='block text-gray-600 mb-2'>Upload Cover Image</label>
          <input type='file' accept='image/*' onChange={handleImageUpload} />
          {image && (
            <img
              src={image}
              alt='Blog Cover'
              className='mt-4 w-full rounded-lg shadow-md'
            />
          )}
        </div>

        {/* Rich Text Editor */}
        <ReactQuill
          value={content}
          onChange={setContent}
          className='mb-5'
          modules={modules}
        />

        {/* Buttons */}
        <div className='flex gap-4'>
          <button
            className='bg-[#2c586a] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#1e4050]'
            onClick={() => handleSubmit(true)}
          >
            Publish Blog
          </button>
          <button
            className='bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-500'
            onClick={() => handleSubmit(false)}
          >
            Save as Draft
          </button>
          <button className='bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700'>
            Preview
          </button>
        </div>
      </div>
    </PageWrapper>
  )
};

export default CrateBlogPage
