'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import {
  addCategories,
  fetchCategories,
  deleteCategory,
  Category
} from '@/redux/slices/categoriesSlice';
import Image from 'next/image';
import unKnownImage from '@/assets/images/unknown.png';
import useToast from '@/components/alerts/Alerts';
import { ToastContainer } from 'react-toastify';
import Pagination from '@/components/pagination/Pagination';
import Select, { SingleValue } from 'react-select';
import { RootState } from '@/redux/store';
import { USER_ROLE } from '@/redux/slices/userSlice';
import { Toast } from 'node_modules/react-toastify/dist/components';
import {
  getCategories,
  CategoryAttributes
} from '@/redux/slices/categorySlice';

interface EmptyDataType {
  message: string;
}

const EmptyData: React.FC<EmptyDataType> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-main-200 rounded-lg shadow-lg p-6 text-center">
        <p className="text-black text-lg">{message}</p>
      </div>
    </div>
  );
};

interface CategoryFormData {
  name: string;
  description: string;
}

const CategoryForm: React.FC<{
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Category Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-main-200 hover:bg-main-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Category
        </button>
      </div>
    </form>
  );
};

const Categories: React.FC = () => {
  const dispatch = useAppDispatch();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;
  const { users, message, success, error } = useAppSelector(
    state => state.registereUsers
  );
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const categories = useAppSelector(
    (state: RootState) => state.categories.categoriesData
  ) as CategoryAttributes[];
  const userRole = useAppSelector((state: RootState) => state.user.role);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (users?.data) {
      const initialToggles = users.data.reduce(
        (acc: { [key: string]: boolean }, user: any) => {
          acc[user.id] = user.status === false;
          return acc;
        },
        {}
      );
      setToggles(initialToggles);
    }
  }, [users]);

  useEffect(() => {
    if (success && message === 'Status has been updated to SUSPENDED') {
      const updatedToggles = { ...toggles };
      Object.keys(updatedToggles).forEach(userId => {
        if (users?.data.find(user => user.id === userId)?.status === false) {
          updatedToggles[userId] = true;
        }
      });
      setToggles(updatedToggles);
    }
  }, [message, success, toggles, users]);

  const roleOptions = [
    { value: 'd290f1ee-6c54-4b01-90e6-d701748f0852', label: 'Buyer' },
    { value: 'd290f1ee-6c54-4b01-90e6-d701748f0851', label: 'Seller' },
    { value: 'd290f1ee-6c54-4b01-90e6-d701748f0853', label: 'Admin' }
  ];

  const handleAddCategory = async (formData: CategoryFormData) => {
    try {
      // Validate input length
      if (formData.name.length < 3) {
        showError('Category name must be at least 3 characters long');
        return;
      }
      if (formData.description.length < 3) {
        showError('Description must be at least 3 characters long');
        return;
      }

      // First fetch categories to ensure we have the latest data
      await dispatch(getCategories());
      // Check if category with same name exists
      const categoryExists = categories?.some(
        category => category.name.toLowerCase() === formData.name.toLowerCase()
      );

      if (categoryExists) {
        showError('The name already exists');
        return;
      }

      const result = await dispatch(addCategories(formData));
      // Check if the action was rejected
      if (addCategories.rejected.match(result)) {
        const errorMessage =
          (result.payload as string) || 'Failed to add category';
        showError(errorMessage);
        return;
      }

      showSuccess('Category added successfully');
      setShowAddForm(false);
      dispatch(getCategories());
    } catch (error) {
      showError(
        error instanceof Error ? error.message : 'Failed to add category'
      );
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await dispatch(deleteCategory(categoryId));
      showSuccess('Category deleted successfully');
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      showError('Failed to delete category');
    }
  };

  const DeleteConfirmationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-4">Are you sure you want to delete this category?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-main-300 hover:bg-main-200 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full sm:p-0 p-3 h-[100%] sm:h-4/6 lg:w-full md:w-full">
        <h1 className="pl-[40%] underline font-bold text-2xl font-sans">
          NEW CATEGORY
        </h1>
        {userRole === USER_ROLE.ADMIN && (
          <div className="mb-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-main-200 hover:bg-main-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {showAddForm ? 'Cancel' : 'Add New Category'}
            </button>
          </div>
        )}

        {showAddForm && (
          <div className="mb-6">
            <CategoryForm
              onSubmit={handleAddCategory}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories?.map((category: CategoryAttributes) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
              {userRole === USER_ROLE.ADMIN && (
                <button
                  onClick={() => {
                    setCategoryToDelete(category.id);
                    setShowDeleteModal(true);
                  }}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCategoryToDelete(null);
        }}
        onConfirm={() =>
          categoryToDelete && handleDeleteCategory(categoryToDelete)
        }
      />

      <ToastContainer />
    </>
  );
};

export default Categories;
