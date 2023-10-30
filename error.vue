<template>
  <div class="error-page">
    <h1 class="error-code">{{ statusCode }}</h1>
    <p class="error-message">{{ errorMessage }}</p>
    <a class="back-home" href="/">Back to home</a>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  statusCode: {
    type: Number,
    default: 404, // Set a default value if the prop is not provided
  },
});

// Customize the error messages based on the status code using computed property
const errorMessage = computed(
  () => `An error occurred. Status Code: ${props.statusCode}`,
);
</script>

<style scoped lang="scss">
/* Add your custom styles here */
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.error-code {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-message {
  font-size: 1.5rem;
}

html,
body {
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: sans-serif;
  background-color: #e7ffff;
}

h1,
a {
  margin: 0;
  padding: 0;
  text-decoration: none;
}

.section {
  padding: 4rem 2rem;
}

.section .error {
  font-size: 150px;
  color: #008b62;
  text-shadow:
    1px 1px 1px #00593e,
    2px 2px 1px #00593e,
    3px 3px 1px #00593e,
    4px 4px 1px #00593e,
    5px 5px 1px #00593e,
    6px 6px 1px #00593e,
    7px 7px 1px #00593e,
    8px 8px 1px #00593e,
    25px 25px 8px rgba(0, 0, 0, 0.2);
}

.page {
  margin: 2rem 0;
  font-size: 20px;
  font-weight: 600;
  color: #444;
}

.back-home {
  display: inline-block;
  border: 2px solid #222;
  color: #222;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0.75rem 1rem 0.6rem;
  transition: all 0.2s linear;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}
.back-home:hover {
  background: #222;
  color: #ddd;
}
</style>
