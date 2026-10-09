<script setup lang="ts">
import { computed } from 'vue';

let uid = 0;
const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    label?: string;
    type?: string;
    inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search';
    placeholder?: string;
    hint?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    maxlength?: number;
    autocomplete?: string;
  }>(),
  {
    type: 'text',
    required: false,
    disabled: false,
    readonly: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const id = `ns-input-${++uid}`;
const describedBy = computed(() =>
  props.error ? `${id}-err` : props.hint ? `${id}-hint` : undefined
);
</script>

<template>
  <div class="ns-field">
    <label v-if="props.label" :for="id" class="ns-field__label">
      {{ props.label }}<span v-if="props.required" class="ns-field__req"> *</span>
    </label>
    <div :class="['ns-field__box', { 'ns-field__box--error': !!props.error, 'ns-field__box--disabled': props.disabled }]">
      <span v-if="$slots.prefix" class="ns-field__prefix">
        <slot name="prefix" />
      </span>
      <input
        :id="id"
        class="ns-field__input"
        :value="props.modelValue"
        :type="props.type"
        :inputmode="props.inputmode"
        :placeholder="props.placeholder"
        :required="props.required"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :maxlength="props.maxlength"
        :autocomplete="props.autocomplete"
        :aria-invalid="!!props.error"
        :aria-describedby="describedBy"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <span v-if="$slots.suffix" class="ns-field__suffix">
        <slot name="suffix" />
      </span>
    </div>
    <p v-if="props.error" :id="`${id}-err`" class="ns-field__msg ns-field__msg--error" role="alert">
      {{ props.error }}
    </p>
    <p v-else-if="props.hint" :id="`${id}-hint`" class="ns-field__msg">
      {{ props.hint }}
    </p>
  </div>
</template>

<style scoped>
.ns-field {
  display: grid;
  gap: var(--ns-space-1, 0.25rem);
  width: 100%;
}

.ns-field__label {
  font-weight: var(--ns-weight-medium, 500);
  font-size: var(--ns-text-sm, 0.875rem);
  color: var(--ns-ash-800, #263330);
}

.ns-field__req {
  color: var(--ns-danger-fg, #991B1B);
}

.ns-field__box {
  display: flex;
  align-items: stretch;
  min-height: var(--ns-touch, 2.75rem);
  background: var(--ns-surface, #FFFFFF);
  border: 1.5px solid var(--ns-ash-300, #B5BFBC);
  border-radius: var(--ns-radius-md, 8px);
  overflow: hidden;
  transition: border-color var(--ns-dur-base, 180ms) var(--ns-ease-out, ease),
              box-shadow var(--ns-dur-base, 180ms) var(--ns-ease-out, ease);
}

.ns-field__box:focus-within {
  border-color: var(--ns-primary, #1F6F5C);
  box-shadow: 0 0 0 3px rgba(31, 111, 92, 0.2);
}

.ns-field__box--error {
  border-color: var(--ns-danger-fg, #991B1B);
}

.ns-field__box--error:focus-within {
  box-shadow: 0 0 0 3px rgba(184, 50, 90, 0.2);
}

.ns-field__box--disabled {
  background: var(--ns-ash-100, #E6EBE9);
  opacity: 0.65;
  cursor: not-allowed;
}

.ns-field__prefix,
.ns-field__suffix {
  display: flex;
  align-items: center;
  padding: 0 var(--ns-space-3, 0.75rem);
  background: var(--ns-ash-50, #F3F5F4);
  color: var(--ns-ash-600, #4F5B57);
  font-size: var(--ns-text-sm, 0.875rem);
}

.ns-field__prefix {
  border-right: 1px solid var(--ns-ash-200, #D5DBD9);
}

.ns-field__suffix {
  border-left: 1px solid var(--ns-ash-200, #D5DBD9);
}

.ns-field__input {
  flex: 1;
  min-width: 0;
  padding: 0 var(--ns-space-3, 0.75rem);
  border: 0;
  background: transparent;
  font: inherit;
  font-size: var(--ns-text-md, 1rem);
  color: var(--ns-text, #17211F);
  outline: none;
}

.ns-field__input::placeholder {
  color: var(--ns-ash-400, #889490);
}

.ns-field__msg {
  margin: 0;
  font-size: var(--ns-text-xs, 0.8125rem);
  color: var(--ns-ash-600, #4F5B57);
}

.ns-field__msg--error {
  color: var(--ns-danger-fg, #991B1B);
  font-weight: var(--ns-weight-medium, 500);
}
</style>
