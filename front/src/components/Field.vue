<script setup lang="ts">
//компонент поля форми

const props = defineProps<{
  title: string;
  type: string;
  name: string;
  modelValue: string;
  validate?: Function;
  white?: boolean;
  placeholder?: string;
  textarea?: boolean;
  error?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

//функція при змінні значення форми
function emitValue(e: Event) {
  let value = (e.target as HTMLInputElement).value;
  emit("update:modelValue", value);

  if (props.validate) {
    props.validate(e);
  }
}
</script>

<template>
  <div class="field">
    <label :class="{ white: white }">{{ title }}</label>
    <input
      v-if="!textarea"
      :class="{ white: white }"
      :type="type"
      :name="name"
      :value="modelValue"
      @input="emitValue"
      :placeholder="placeholder"
    />
    <textarea
      rows="5"
      v-if="textarea"
      :class="{ white: white }"
      :type="type"
      :name="name"
      :value="modelValue"
      @input="emitValue"
      :placeholder="placeholder"
    ></textarea>
    <span class="error" v-if="error">{{ error }}</span>
  </div>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

input,
textarea {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #000;
  transition: border-color 0.4s;
}

input:focus {
  border-color: #3898ec;
}

label.white {
  color: #fff;
}

input.white,
textarea.white {
  background-color: #f7fafc;
  border: unset;
}

.error {
  color: red;
}
</style>
