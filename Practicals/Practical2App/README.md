# Practical 2 - Responsive Layout in React Native

## Objective
Build a React Native Expo app with:
- At least two screens
- Responsive layouts using Flexbox and flexible sizing
- Navigation between screens
- Layout behavior that adapts to different screen sizes and orientations

## Implemented Screens
This practical uses two screens inside a stack navigator:
- Home (Responsive Home)
- About (About This Practical)

Navigation flow:
- Home -> About using a button
- About -> Home using a Go Back button

## Core Concepts Used
1. Flexbox Layout
- `flex: 1` for screen containers and cards
- `flexDirection` changes based on screen width
- `alignSelf`, spacing, and responsive wrapping behavior

2. Flexible Dimensions
- `width: '100%'` for full-width blocks on narrow screens
- `flex: 1` to distribute available space on wider screens
- Padding and spacing instead of hard-coded position values

3. ScrollView and Safe Areas
- Both screens use `ScrollView` with `contentContainerStyle={{ flexGrow: 1 }}`
- `SafeAreaView` is used to avoid overlap with notches/status bars

4. `useWindowDimensions`
- The current screen width is read at runtime
- Breakpoint rule: `isWide = width >= 600`
- Layout changes from column to row when `isWide` is true

## Files Updated
- `scr/screen/HomeScreen.tsx`
- `scr/screen/AboutScreen.tsx`

## How to Run
1. Install dependencies:
```bash
npm install
```

2. Start Expo:
```bash
npm start
```

3. Open on:
- Expo Go (phone)
- Android emulator
- iOS simulator

## Suggested Testing Steps
1. Open the Home screen on a phone-sized viewport.
2. Confirm cards are stacked vertically.
3. Rotate device or switch to a tablet-sized emulator.
4. Confirm cards move side-by-side (row layout).
5. Navigate to About and verify the same responsive behavior.
6. Check that all content remains readable and does not overlap.

## Sample Input/Observed Output
Input:
- User launches app on Home.
- User rotates device or uses larger screen.
- User taps navigation buttons.

Observed Output:
- Card sections reflow from column to row at larger widths.
- Content remains inside safe area and scrolls when needed.
- Navigation works correctly between Home and About.

## Common Mistakes to Avoid
- Using fixed width/height values that break on different screens.
- Skipping `ScrollView` for content that may overflow on small devices.
- Ignoring `useWindowDimensions` when breakpoint behavior is required.
- Not testing in both portrait/landscape or phone/tablet sizes.

## Viva Questions and Answers
1. What is meant by a responsive layout in mobile applications?
A responsive layout automatically adapts component sizes, spacing, and arrangement to different screen sizes and orientations so the UI stays readable and usable.

2. How does Flexbox help in building responsive UIs in React Native?
Flexbox lets developers distribute and align elements dynamically using rules like `flex`, `flexDirection`, `justifyContent`, and `alignItems`, which helps layouts adapt to available space.

3. Why is it discouraged to use fixed pixel values for widths and heights?
Fixed pixel values may look fine on one device but can cause clipping, overlap, or excessive empty space on others. Flexible values are more device-independent.

4. What is the purpose of `useWindowDimensions`?
`useWindowDimensions` provides real-time width and height of the app window, enabling breakpoint-based layout changes (for example, switching from column to row on wider screens).

5. How can `ScrollView` contribute to responsiveness on small devices?
`ScrollView` allows content to remain accessible when it cannot fully fit vertically, preventing UI content from being cut off.

6. How does navigation interact with layout design from a UX perspective?
Good navigation and responsive layouts together ensure users can move between screens smoothly while maintaining clarity and usability on all device sizes.

7. What differences might be observed on a phone versus a tablet?
On phones, sections are usually stacked for readability. On tablets, the same sections can appear side-by-side, with more horizontal space and less scrolling.

## Observation Notes
- App launches and navigation works without runtime navigation errors.
- Layout adapts based on width using a simple breakpoint.
- Scrollable containers protect against content cutoff on smaller devices.
- If no visible layout change occurs, verify breakpoint logic and container flex rules.
