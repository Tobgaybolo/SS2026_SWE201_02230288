# Assignment 2: Student Productivity App

A modern, fully-functional React Native mobile app demonstrating multi-screen navigation, smooth animations, gesture interactions, and responsive UI design.

## 🎯 Overview

**Student Productivity Hub** is a learning management app built with React Native that showcases:
- Multi-screen tab and stack navigation
- Professional UI/UX design
- Smooth animations using React Native Animated API
- Interactive gesture handling with drag support
- Fully responsive design for all screen sizes

## ✨ Key Features

### Screens
1. **Home** - greeting, study stats, quick focus card, today's tasks
2. **Tasks (Categories)** - subjects grid with progress bars and filter pills
3. **Task Detail** - subtask checklist, progress bar, notes
4. **Focus Timer** - animated progress ring, Pomodoro selector, session tracker
5. **Profile/Settings** - stats, preferences, and link to Animation Demo
6. **Animation Demo** - accessible via Profile; showcases animations and gestures

### Navigation
- **Tab Navigation:** 4 bottom tabs (Home 🏠, Tasks 📁, Focus ⏱️, Profile 👤)
- **Stack Navigation:** Detail screen for category information
- Smooth transitions and header customization

### Animations (React Native Animated API)
- ✅ Fade In/Out Animation
- ✅ Scale & Bounce Animation
- ✅ Bounce Animation
- ✅ Gesture-Driven Drag (PanResponder)

### Design
- Clean, professional color scheme
- Responsive layout (adapts to narrow and wide screens)
- Consistent typography and spacing
- Visual feedback on interactions

## 📦 Project Structure

```
Assignment 2/
├── scr/
│   ├── components/
│   │   └── TaskCard.tsx (Reusable card component)
│   ├── screen/
│   │   ├── HomeScreen.tsx
│   │   ├── CategoryScreen.tsx
│   │   ├── DetailScreen.tsx
│   │   ├── AnimationDemoScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── navigation/
│       ├── MainStackNavigator.tsx
│       └── BottomTabNavigator.tsx
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── REPORT.md (Detailed app documentation)
└── README.md (This file)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI (optional)

### Installation

```bash
cd "Assignment 2"
npm install
```

### Running the App

Using Expo:
```bash
npm start
```

Then select:
- Press `i` for iOS
- Press `a` for Android
- Press `w` for Web

Or run specific commands:
```bash
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

## 🎮 How to Use

1. **Home Tab (🏠)** - View app overview and features
2. **Categories Tab (📁)** - Browse categories and tap one to see details
3. **Animations Tab (✨)** - Interact with 4 different animations
4. **Profile Tab (👤)** - View profile and settings

### Testing Animations
- **Fade Animation:** Tap "Trigger Fade" to see element fade in/out
- **Scale Animation:** Tap "Trigger Scale" to see bouncing effect
- **Bounce Animation:** Tap "Trigger Bounce" for vertical bounce
- **Drag Gesture:** Press and drag the purple box around

## 🛠️ Technical Stack

- **Framework:** React Native with Expo
- **Navigation:** React Navigation v7
- **Animations:** React Native Animated API
- **Language:** TypeScript
- **Gestures:** PanResponder (built-in)
- **UI Components:** React Native core components

## 🎨 Design System

### Colors
- Primary: `#0f172a` (Dark navy)
- Light Background: `#f3f6fa` (Light blue)
- Card Background: `#ffffff` (White)
- Text: `#364152` to `#0f172a` (Gray to dark)
- Borders: `#dde4ee` (Light gray)

### Typography
- Titles: 28-32px, Bold
- Subtitles: 16px, Regular
- Body: 14px, Regular
- Button: 15px, Semibold

### Spacing
- Screen padding: 18px
- Gap between elements: 12-16px
- Section margins: 24px

## 📋 Requirements Met

✅ Multi-screen navigation (5 screens)  
✅ Stack navigation (MainStackNavigator + Detail)  
✅ Tab navigation (BottomTabNavigator with 4 tabs)  
✅ Responsive layout (adapts to screen width)  
✅ 4 animations using Animated API  
✅ Gesture interaction (drag with PanResponder)  
✅ Screen transitions  
✅ Reusable components (TaskCard)  
✅ No backend/API calls  
✅ No database  
✅ Clean code organization  
✅ TypeScript support  
✅ Professional UI/UX  

## 📝 Additional Documentation

See [REPORT.md](REPORT.md) for:
- Detailed app description
- Navigation flow diagram
- Animation implementation details
- UI/UX design decisions
- Code organization explanation
- Learning outcomes

## 🔧 Customization

To modify the app:

1. **Change colors:** Update `StyleSheet` values in each screen
2. **Add screens:** Create new `.tsx` file in `scr/screen/`
3. **Modify animations:** Edit animation values in `AnimationDemoScreen.tsx`
4. **Update categories:** Modify array in `CategoryScreen.tsx`

## ⚡ Performance Notes

- Animations use `useNativeDriver` where possible for 60fps performance
- PanResponder for efficient gesture handling
- ScrollView prevents rendering off-screen content
- Responsive design uses computed dimensions instead of fixed values

## 🎓 Learning Resources

This project demonstrates:
- React Native best practices
- Navigation patterns (tabs + stack)
- Animation principles
- Gesture handling
- Responsive design
- Component composition
- TypeScript in React Native

## 📸 Screenshots

Capture all major screens:
1. Home/Dashboard
2. Categories List
3. Category Details
4. Animation Demo (all 4 animations visible)
5. Profile/Settings

Compile into a PDF for submission.

## 📧 Support

For issues or questions:
1. Check REPORT.md for detailed documentation
2. Review screen component comments
3. Verify all dependencies installed: `npm list`
4. Clear cache: `npm start -- --clear`

---

**Status:** ✅ Complete and Ready for Submission

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
