
# NativeWind Utility Classes Reference

## Layout

### Flexbox
- `flex`: Sets the element to use flex layout.
- `flex-row`: Arranges children in a row.
- `flex-col`: Arranges children in a column.

**Example**:
```jsx
<View className="flex flex-row justify-center items-center">
  <Text className="text-lg">Hello, Flexbox!</Text>
</View>
```

## Spacing

### Padding
- `p-4`: Applies padding of 1rem (16px) on all sides.
- `pt-2`: Applies padding-top of 0.5rem (8px).

**Example**:
```jsx
<View className="p-4 pt-2 pb-3">
  <Text className="text-lg">Padded Text</Text>
</View>
```

## Typography

### Text Size
- `text-sm`: Small text size.
- `text-lg`: Large text size.

**Example**:
```jsx
<Text className="text-sm">Small Text</Text>
<Text className="text-lg">Large Text</Text>
```

## Background

### Background Color
- `bg-blue-500`: Applies a blue background color.
- `bg-red-300`: Applies a red background color.

**Example**:
```jsx
<View className="bg-blue-500 p-4">
  <Text className="text-white">Blue Background</Text>
</View>
```

## Borders

### Border Width
- `border`: Applies a default border width.
- `border-2`: Applies a border width of 2px.

**Example**:
```jsx
<View className="border border-2 border-t-4 border-blue-500 p-4">
  <Text className="text-lg">Bordered View</Text>
</View>
```

## Effects

### Shadow
- `shadow`: Applies a default shadow.
- `shadow-lg`: Applies a large shadow.

**Example**:
```jsx
<View className="shadow shadow-lg p-4">
  <Text className="text-lg">Shadowed View</Text>
</View>
```

### Opacity
- `opacity-50`: Sets the opacity of an element to 50%.

**Example**:
```jsx
<View className="opacity-50 p-4">
  <Text className="text-lg">Semi-transparent View</Text>
</View>
```
