<template>
  <div>
      <div v-if="showAdmin">
          <h2>Add New Component</h2>
          <form @submit.prevent="addComponent">
              <label>
                  Paste Figma Component:
                  <textarea v-model="plainText" @paste="handlePaste" required></textarea>
              </label>
              <label>
                  HTML Content:
                  <textarea v-model="htmlText" readonly></textarea>
              </label>
              <label>
                  Title:
                  <input v-model="title" required>
              </label>
              <label>
                  Image URL:
                  <input v-model="image" required>
              </label>
              <label>
                  <input type="checkbox" v-model="isFree"> Free Component
              </label>
              <div v-if="!isFree">
                  <label>
                      Price (in euros):
                      <input type="number" v-model="price" step="0.01" min="0" required>
                  </label>
              </div>
              <button type="submit">Add Component</button>
          </form>
      </div>
      <div v-else>
          <h2>Available Components</h2>
          <div v-if="components.length === 0">
              No components available. Add some from the Admin page.
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="component in components" :key="component.id" class="border rounded p-4">
                  <img :src="component.image" :alt="component.title" class="w-full h-48 object-cover mb-2">
                  <h3 class="text-xl font-bold">{{ component.title }}</h3>
                  <p>{{ component.isFree ? 'Free' : `€${component.price.toFixed(2)}` }}</p>
                  <button @click="copyComponent(component)" class="bg-green-500 text-white px-4 py-2 rounded mt-2">
                      Copy Component
                  </button>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { useApi } from '@directus/extensions-sdk';
import { ref } from 'vue';

export default {
  props: {
      showAdmin: {
          type: Boolean,
          default: false,
      },
  },
  setup() {
      const api = useApi();
      const components = ref([]);
      const plainText = ref('');
      const htmlText = ref('');
      const title = ref('');
      const image = ref('');
      const isFree = ref(true);
      const price = ref('');

      const fetchComponents = async () => {
          try {
              const response = await api.get('/items/figma_components');
              components.value = response.data.data;
          } catch (error) {
              console.error('Error fetching components:', error);
          }
      };

      const addComponent = async () => {
          try {
              const newComponent = {
                  plainText: plainText.value,
                  htmlText: htmlText.value,
                  title: title.value,
                  image: image.value,
                  isFree: isFree.value,
                  price: isFree.value ? null : parseFloat(price.value),
              };
              await api.post('/items/figma_components', newComponent);
              fetchComponents();
              plainText.value = '';
              htmlText.value = '';
              title.value = '';
              image.value = '';
              isFree.value = true;
              price.value = '';
              alert('Component added successfully!');
          } catch (error) {
              console.error('Error adding component:', error);
              alert('Failed to add component');
          }
      };

      const handlePaste = (e) => {
          e.preventDefault();
          const clipboardData = e.clipboardData;
          plainText.value = clipboardData.getData('text/plain');
          htmlText.value = clipboardData.getData('text/html');
      };

      const copyComponent = (component) => {
          const blob = new Blob([component.htmlText], { type: 'text/html' });
          const plainText = component.plainText;

          navigator.clipboard.write([
              new ClipboardItem({
                  'text/plain': new Blob([plainText], { type: 'text/plain' }),
                  'text/html': blob
              })
          ]).then(() => {
              alert('Component copied to clipboard!');
          }).catch(err => {
              console.error('Failed to copy: ', err);
          });
      };

      fetchComponents();

      return {
          components,
          plainText,
          htmlText,
          title,
          image,
          isFree,
          price,
          handlePaste,
          addComponent,
          copyComponent,
      };
  },
};
</script>

<style scoped>
/* Add any necessary styles */
</style>