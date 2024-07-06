# NativeWind Utilities Guide

## Layout
- **Container**: `container`
  - Centers content and sets a maximum width.

- **Box Sizing**:
  - `box-border`: Includes padding and border in the element's total width and height.
  - `box-content`: Does not include padding and border in the element's total width and height.

- **Display**:
  - `block`: Displays an element as a block element (like a `<div>`).
  - `inline-block`: Displays an element as an inline-level block container.
  - `inline`: Displays an element as an inline element (like a `<span>`).
  - `flex`: Displays an element as a block-level flex container.
  - `inline-flex`: Displays an element as an inline-level flex container.
  - `grid`: Displays an element as a block-level grid container.
  - `inline-grid`: Displays an element as an inline-level grid container.
  - `hidden`: Hides an element.

- **Floats**:
  - `float-right`: Floats an element to the right.
  - `float-left`: Floats an element to the left.
  - `float-none`: Removes float.

- **Clear**:
  - `clear-left`: Prevents an element from floating to the left of floated elements.
  - `clear-right`: Prevents an element from floating to the right of floated elements.
  - `clear-both`: Prevents an element from floating to either side of floated elements.
  - `clear-none`: Allows an element to float next to floated elements.

- **Object Fit**:
  - `object-contain`: Scales the image as large as possible without cropping or stretching.
  - `object-cover`: Scales the image as large as possible and crops the edges to fill the container.
  - `object-fill`: Stretches the image to fill the container.
  - `object-none`: Keeps the original size of the image.
  - `object-scale-down`: Scales the image down to fit the container while maintaining its aspect ratio.

- **Object Position**:
  - `object-bottom`: Aligns the bottom of the image with the bottom of the container.
  - `object-center`: Centers the image within the container.
  - `object-left`: Aligns the left edge of the image with the left edge of the container.
  - `object-left-bottom`: Aligns the left and bottom edges of the image with the left and bottom edges of the container.
  - `object-left-top`: Aligns the left and top edges of the image with the left and top edges of the container.
  - `object-right`: Aligns the right edge of the image with the right edge of the container.
  - `object-right-bottom`: Aligns the right and bottom edges of the image with the right and bottom edges of the container.
  - `object-right-top`: Aligns the right and top edges of the image with the right and top edges of the container.
  - `object-top`: Aligns the top of the image with the top of the container.

- **Overflow**:
  - `overflow-auto`: Adds scrollbars when necessary.
  - `overflow-hidden`: Clips content that overflows the element’s box.
  - `overflow-visible`: Default. Content is not clipped.
  - `overflow-scroll`: Always shows scrollbars.

- **Position**:
  - `static`: Default position; the element is positioned according to the normal flow of the document.
  - `fixed`: The element is positioned relative to the browser window.
  - `absolute`: The element is positioned relative to its nearest positioned ancestor.
  - `relative`: The element is positioned relative to its normal position.
  - `sticky`: The element is positioned based on the user's scroll position.

- **Top/Right/Bottom/Left**:
  - `top-0`, `right-0`, `bottom-0`, `left-0`: Sets the top, right, bottom, or left position of a positioned element to 0.
  - `top-1`, `right-1`, `bottom-1`, `left-1`, etc.: Sets the top, right, bottom, or left position of a positioned element. The number can range from 0 to 96.

- **Z-Index**:
  - `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-auto`: Controls the stacking order of elements. Higher values stack elements on top of lower values.

## Flexbox & Grid
- **Flex Direction**:
  - `flex-row`: Aligns flex items in a row.
  - `flex-row-reverse`: Aligns flex items in a row in reverse order.
  - `flex-col`: Aligns flex items in a column.
  - `flex-col-reverse`: Aligns flex items in a column in reverse order.

- **Flex Wrap**:
  - `flex-wrap`: Allows flex items to wrap onto multiple lines.
  - `flex-wrap-reverse`: Allows flex items to wrap onto multiple lines in reverse order.
  - `flex-nowrap`: Prevents flex items from wrapping onto multiple lines.

- **Align Items**:
  - `items-start`: Aligns flex items to the start of the cross axis.
  - `items-end`: Aligns flex items to the end of the cross axis.
  - `items-center`: Aligns flex items to the center of the cross axis.
  - `items-baseline`: Aligns flex items along the baseline.
  - `items-stretch`: Stretches flex items to fill the container.

- **Align Content**:
  - `content-start`: Aligns flex lines to the start of the container.
  - `content-end`: Aligns flex lines to the end of the container.
  - `content-center`: Centers flex lines in the container.
  - `content-between`: Distributes flex lines evenly with space between them.
  - `content-around`: Distributes flex lines evenly with space around them.
  - `content-evenly`: Distributes flex lines evenly with equal space between them.

- **Justify Content**:
  - `justify-start`: Aligns flex items to the start of the main axis.
  - `justify-end`: Aligns flex items to the end of the main axis.
  - `justify-center`: Centers flex items along the main axis.
  - `justify-between`: Distributes flex items evenly with space between them.
  - `justify-around`: Distributes flex items evenly with space around them.
  - `justify-evenly`: Distributes flex items evenly with equal space between them.

- **Align Self**:
  - `self-auto`: Default. Aligns the flex item according to the align-items property of the flex container.
  - `self-start`: Aligns the flex item to the start of the cross axis.
  - `self-end`: Aligns the flex item to the end of the cross axis.
  - `self-center`: Centers the flex item along the cross axis.
  - `self-stretch`: Stretches the flex item to fill the container.

- **Order**:
  - `order-first`, `order-last`, `order-none`, `order-1`, `order-2`, etc.: Controls the order of flex items. The number can range from -1 to 12.

- **Flex**:
  - `flex-1`: Specifies that the flex item will grow and shrink as needed to fill the available space.
  - `flex-auto`: Specifies that the flex item will grow and shrink as needed, but takes into account the item's initial size.
  - `flex-initial`: Specifies that the flex item will shrink but not grow.
  - `flex-none`: Specifies that the flex item will not grow or shrink.

## Spacing
- **Padding**: `p-0`, `p-1`, `p-2`, `p-3`, `p-4`, `p-5`, `p-6`, `p-7`, `p-8`, `p-9`, `p-10`
  - Sets padding for an element.
  - Per Side: `pt-1`, `pr-1`, `pb-1`, `pl-1`, etc.
  - Per Axis: `px-1`, `py-1`, etc.
  - `p-1` sets padding to 0.25rem (4px) for all sides. The number can range from 0 to 10.

- **Margin**: `m-0`, `m-1`, `m-2`, `m-3`, `m-4`, `m-5`, `m-6`, `m-7`, `m-8`, `m-9`, `m-10`
  - Sets margin for an element.
  - Per Side: `mt-1`, `mr-1`, `mb-1`, `ml-1`, etc.
  - Per Axis: `mx-1`, `my-1`, etc.
  - `m-1` sets margin to 0.25rem (4px) for all sides. The number can range from 0 to 10.

- **Space Between**: `space-x-1`, `space-x-2`, `space-y-1`, `space-y-2`, etc.
  - Controls the space between child elements in a flex container.

## Sizing
- **Width**: `w-0`, `w-1`, `w-2`, `w-3`, `w-4`, `w-5`, `w-6`, `w-7`, `w-8`, `w-9`, `w-10`, `w-11`, `w-12`, `w-16`, `w-20`, `w-24`, `w-28`, `w-32`, `w-36`, `w-40`, `w-44`, `w-48`, `w-52`, `w-56`, `w-60`, `w-64`, `w-72`, `w-80`, `w-96`, `w-auto`, `w-px`, `w-full`, `w-screen`
  - Sets the width of an element.
  - `w-1` sets width to 0.25rem (4px). The number can range from 0 to 96.
  - `w-px` sets the width to 1px.
  - `w-full` sets the width to 100%.
  - `w-screen` sets the width to 100vw (viewport width).

- **Min-Width**: `min-w-0`, `min-w-full`
  - Sets the minimum width of an element.
  - `min-w-0` sets the minimum width to 0.
  - `min-w-full` sets the minimum width to 100%.

- **Max-Width**: `max-w-xs`, `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`, `max-w-2xl`, `max-w-3xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, `max-w-7xl`, `max-w-full`, `max-w-min`, `max-w-max`, `max-w-prose`, `max-w-screen-sm`, `max-w-screen-md`, `max-w-screen-lg`, `max-w-screen-xl`
  - Sets the maximum width of an element.
  - `max-w-xs` sets the maximum width to 20rem (320px). Sizes range from xs to 7xl.
  - `max-w-full` sets the maximum width to 100%.
  - `max-w-screen-sm` sets the maximum width to the screen size of small devices.

- **Height**: `h-0`, `h-1`, `h-2`, `h-3`, `h-4`, `h-5`, `h-6`, `h-7`, `h-8`, `h-9`, `h-10`, `h-11`, `h-12`, `h-16`, `h-20`, `h-24`, `h-28`, `h-32`, `h-36`, `h-40`, `h-44`, `h-48`, `h-52`, `h-56`, `h-60`, `h-64`, `h-72`, `h-80`, `h-96`, `h-auto`, `h-px`, `h-full`, `h-screen`
  - Sets the height of an element.
  - `h-1` sets height to 0.25rem (4px). The number can range from 0 to 96.
  - `h-px` sets the height to 1px.
  - `h-full` sets the height to 100%.
  - `h-screen` sets the height to 100vh (viewport height).

- **Min-Height**: `min-h-0`, `min-h-full`, `min-h-screen`
  - Sets the minimum height of an element.
  - `min-h-0` sets the minimum height to 0.
  - `min-h-full` sets the minimum height to 100%.
  - `min-h-screen` sets the minimum height to 100vh (viewport height).

- **Max-Height**: `max-h-0`, `max-h-full`, `max-h-screen`
  - Sets the maximum height of an element.
  - `max-h-0` sets the maximum height to 0.
  - `max-h-full` sets the maximum height to 100%.
  - `max-h-screen` sets the maximum height to 100vh (viewport height).

## Typography
- **Font Family**: 
  - `font-sans`: Applies a sans-serif font family.
  - `font-serif`: Applies a serif font family.
  - `font-mono`: Applies a monospace font family.

- **Font Size**: 
  - `text-xs`: Applies a font size of 0.75rem (12px).
  - `text-sm`: Applies a font size of 0.875rem (14px).
  - `text-base`: Applies a font size of 1rem (16px).
  - `text-lg`: Applies a font size of 1.125rem (18px).
  - `text-xl`: Applies a font size of 1.25rem (20px).
  - `text-2xl`: Applies a font size of 1.5rem (24px).
  - `text-3xl`: Applies a font size of 1.875rem (30px).
  - `text-4xl`: Applies a font size of 2.25rem (36px).
  - `text-5xl`: Applies a font size of 3rem (48px).
  - `text-6xl`: Applies a font size of 3.75rem (60px).
  - `text-7xl`: Applies a font size of 4.5rem (72px).
  - `text-8xl`: Applies a font size of 6rem (96px).
  - `text-9xl`: Applies a font size of 8rem (128px).

- **Font Smoothing**: 
  - `antialiased`: Applies font-smoothing: antialiased.
  - `subpixel-antialiased`: Applies font-smoothing: subpixel-antialiased.

- **Font Style**: 
  - `italic`: Applies italic style to text.
  - `not-italic`: Removes italic style from text.

- **Font Weight**: 
  - `font-thin`: Applies font weight 100.
  - `font-extralight`: Applies font weight 200.
  - `font-light`: Applies font weight 300.
  - `font-normal`: Applies font weight 400.
  - `font-medium`: Applies font weight 500.
  - `font-semibold`: Applies font weight 600.
  - `font-bold`: Applies font weight 700.
  - `font-extrabold`: Applies font weight 800.
  - `font-black`: Applies font weight 900.

## Backgrounds
- **Background Color**: 
  - `bg-transparent`: Applies transparent background color.
  - `bg-black`: Applies black background color.
  - `bg-white`: Applies white background color.
  - `bg-gray-100`, `bg-gray-200`, etc.: Applies various shades of gray background color. (shades range from 50 to 900)
  - `bg-red-100`, `bg-red-200`, etc.: Applies various shades of red background color. (shades range from 50 to 900)
  - `bg-yellow-100`, `bg-yellow-200`, etc.: Applies various shades of yellow background color. (shades range from 50 to 900)
  - `bg-green-100`, `bg-green-200`, etc.: Applies various shades of green background color. (shades range from 50 to 900)
  - `bg-blue-100`, `bg-blue-200`, etc.: Applies various shades of blue background color. (shades range from 50 to 900)
  - `bg-indigo-100`, `bg-indigo-200`, etc.: Applies various shades of indigo background color. (shades range from 50 to 900)
  - `bg-purple-100`, `bg-purple-200`, etc.: Applies various shades of purple background color. (shades range from 50 to 900)
  - `bg-pink-100`, `bg-pink-200`, etc.: Applies various shades of pink background color. (shades range from 50 to 900)

## Borders
- **Border Radius**: 
  - `rounded-none`: Removes border radius.
  - `rounded-sm`: Applies small border radius.
  - `rounded`: Applies default border radius.
  - `rounded-md`: Applies medium border radius.
  - `rounded-lg`: Applies large border radius.
  - `rounded-xl`: Applies extra-large border radius.
  - `rounded-2xl`: Applies 2x extra-large border radius.
  - `rounded-3xl`: Applies 3x extra-large border radius.
  - `rounded-full`: Applies full border radius, making the element a circle or oval.

- **Border Width**: 
  - `border-0`: Removes border.
  - `border-2`: Applies a 2px border.
  - `border-4`: Applies a 4px border.
  - `border-8`: Applies an 8px border.
  - `border`: Applies a 1px border.

- **Border Color**: 
  - `border-transparent`: Applies transparent border color.
  - `border-black`: Applies black border color.
  - `border-white`: Applies white border color.
  - `border-gray-100`, `border-gray-200`, etc.: Applies various shades of gray border color. (shades range from 50 to 900)
  - `border-red-100`, `border-red-200`, etc.: Applies various shades of red border color. (shades range from 50 to 900)
  - `border-yellow-100`, `border-yellow-200`, etc.: Applies various shades of yellow border color. (shades range from 50 to 900)
  - `border-green-100`, `border-green-200`, etc.: Applies various shades of green border color. (shades range from 50 to 900)
  - `border-blue-100`, `border-blue-200`, etc.: Applies various shades of blue border color. (shades range from 50 to 900)
  - `border-indigo-100`, `border-indigo-200`, etc.: Applies various shades of indigo border color. (shades range from 50 to 900)
  - `border-purple-100`, `border-purple-200`, etc.: Applies various shades of purple border color. (shades range from 50 to 900)
  - `border-pink-100`, `border-pink-200`, etc.: Applies various shades of pink border color. (shades range from 50 to 900)

## Shadows
- **Box Shadow**: 
  - `shadow-sm`: Applies small box shadow.
  - `shadow`: Applies default box shadow.
  - `shadow-md`: Applies medium box shadow.
  - `shadow-lg`: Applies large box shadow.
  - `shadow-xl`: Applies extra-large box shadow.
  - `shadow-2xl`: Applies 2x extra-large box shadow.
  - `shadow-inner`: Applies inner box shadow.
  - `shadow-outline`: Applies outline box shadow.
  - `shadow-none`: Removes box shadow.

## Opacity
- **Opacity**: 
  - `opacity-0`: Applies 0% opacity.
  - `opacity-25`: Applies 25% opacity.
  - `opacity-50`: Applies 50% opacity.
  - `opacity-75`: Applies 75% opacity.
  - `opacity-100`: Applies 100% opacity.

## Others
- **Cursor**: 
  - `cursor-auto`: Applies default cursor.
  - `cursor-default`: Applies default cursor.
  - `cursor-pointer`: Applies pointer cursor.
  - `cursor-wait`: Applies wait cursor.
  - `cursor-text`: Applies text cursor.
  - `cursor-move`: Applies move cursor.
  - `cursor-not-allowed`: Applies not-allowed cursor.

- **Pointer Events**: 
  - `pointer-events-none`: Disables pointer events.
  - `pointer-events-auto`: Enables pointer events.

- **Resize**: 
  - `resize-none`: Disables resizing.
  - `resize-y`: Enables vertical resizing.
  - `resize-x`: Enables horizontal resizing.
  - `resize`: Enables both horizontal and vertical resizing.

- **User Select**: 
  - `select-none`: Disables text selection.
  - `select-text`: Enables text selection.
  - `select-all`: Enables selection of all text.
  - `select-auto`: Applies default selection behavior.