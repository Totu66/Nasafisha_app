import { ref } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import api from "@/providers/api/axios";

export const useProductStore = defineStore("products", () => {
  /**
   * STATE
   * - `products`: Holds the list of products for the current view.
   * - `product`: Holds the single product being viewed or edited.
   * - `loading`: A boolean to track when any API call is in progress.
   * - `error`: A string to hold the last error message, for display in the UI.
   */
  const products = ref([]);
  const product = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // const addProductForm = useLocalStorage("addProductForm", null);

  /**ACTIONS */
  /**Fetch all products from API and update state */
  async function fetchProducts() {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await api.get("/products");
      products.value = data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch products.";
      error.value = errorMessage;
      console.error("Error fetching products:", err);
      /**throw error to component */
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  /**Fetch single product by ID */
  async function fetchProductById(productId) {
    loading.value = true;
    error.value = null;
    product.value = null; //reset previous

    try {
      const { data } = await api.get(`/products/${productId}`);
      product.value = data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Product not found.";
      error.value = errorMessage;
      console.error("Error fetching product:", err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  /**Add a new productand update local state on success */
  async function addProduct(productData) {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await api.post("/products", productData);
      /**Add new product to the start of our local array */
      products.value.unshift(data);
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to add product.";
      error.value = errorMessage;
      console.error("Error adding product:", err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  /**Update existing product and updates local state on success */
  async function updateProduct(productId, productData) {
    loading.value = true;
    error.value = null;

    try {
      const { data } = await api.patch(`/products/${productId}`, productData);
      /**Find and update product in local array */
      const index = products.value.findIndex((p) => p.id === productId);
      if (index !== -1) {
        products.value[index] = data;
      }
      return data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update product.";
      error.value = errorMessage;
      console.error("Error updating product:", err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  /**Delete a product and remove it from the local state on success */
  async function deleteProduct(productId) {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(`/products/${productId}`);
      /**Remove product from local array */
      products.value = products.value.filter((p) => p.id !== productId);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete product.";
      error.value = errorMessage;
      console.error("Error deleting product:", err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  /**RETURN SECTION */
  return {
    loading,
    products,
    product,
    error,
    fetchProducts,
    fetchProductById,
    addProduct,
    updateProduct,
    deleteProduct,
  };
});
