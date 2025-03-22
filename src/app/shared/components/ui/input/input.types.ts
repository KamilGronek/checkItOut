/**
 * Standard HTML input types supported by the Material Input component.
 * These are the native input types that can be used with mat-input.
 *
 * - text: Standard text input
 * - password: Password input with masking
 * - email: Email input with email validation
 * - number: Numeric input with step controls
 * - tel: Telephone number input
 * - url: URL input with validation
 * - search: Search input field
 * - date: Date input (browser native)
 * - datetime-local: Date and time input (browser native)
 * - month: Month selector (browser native)
 * - week: Week selector (browser native)
 * - time: Time input (browser native)
 */
type MatInputType =
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'date'
    | 'datetime-local'
    | 'month'
    | 'week'
    | 'time';

/**
 * Custom input types that extend beyond standard HTML input types.
 * These are specialized input types that require custom rendering and behavior.
 *
 * - checkbox: Boolean selection via checkbox
 * - textarea: Multi-line text input
 * - image: Image upload with preview and storage
 * - datepicker: Material Design date picker
 * - daterange: Material Design date range picker
 */
type OtherInputType = 'checkbox' | 'textarea' | 'image' | 'datepicker' | 'daterange';


export { MatInputType, OtherInputType };
