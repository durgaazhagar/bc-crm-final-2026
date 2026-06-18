FeatureInventory Component

Usage:

1. Import and render in your app:

```jsx
import FeatureInventory from './components/FeatureInventory'

function App(){
  return <FeatureInventory />
}

export default App
```

2. The component uses local state initialized from `src/data/features.js`. Modify or replace that file to extend data.
3. Actions supported: View, Edit, Delete, Add. The modal and form are local-state only; connect to an API by replacing setFeatures calls.
