# :gear: fitbody-FE Customization Guide

A strict, senior-level engineering standard for building scalable, optimized apps using the MERN stack.

**Stack:** · React · JavaScript · Tailwind CSS v4 · shadcn/ui · Tanstack query

---

## :rocket: Core Philosophy

- Keep everything modular and reusable
- No repeated logic (DRY)
- One responsibility per unit (SRP)
- Clear separation of concerns
- Performance-first mindset

---

## :file_folder: Naming Conventions

### Files & Folders

- Use **kebab-case only**

```
user-card.jsx
auth-service.js
use-users.js
```

- :x: Never use:

  * camelCase filenames
  * PascalCase filenames

---

## :no_entry_sign: Barrel Files (Strictly Forbidden)

Do not create index files for re-exporting.

```js
// :x: Forbidden
export { default as UserCard } from "./user-card/user-card";
```

```js
// :white_check_mark: Correct
import UserCard from "@components/user-card/user-card";
```

---

## :jigsaw: Component Architecture

Each component must follow **folder-module structure**:

```
components/
└── user-card/
    ├── user-card.jsx
    └── use-user-card.js
```

### Rules

- One component per folder
- Extract logic into hooks
- No one-off components

---

## :brain: React Design Patterns (Mandatory)

### 1. Compound Components

Use when components share internal state.

```jsx
<Select>
    
  <Select.Trigger />
    
  <Select.Options>
        <Select.Option value="admin">Admin</Select.Option>
      
  </Select.Options>
</Select>
```

---

### 2. Strategy Pattern

Use for dynamic behavior switching:

- Sorting
- Filtering
- Permissions
- API handling

```js
export const sortStrategies = {
  byName: (a, b) => a.name.localeCompare(b.name),
  byDate: (a, b) => new Date(b.created_at) - new Date(a.created_at),
};
```

---

### 3. Custom Hooks

Move logic out of UI.

```js
const useUsers = () => {
  const [data, setData] = useState([]);
  return { data };
};
```

---

### 4. Container / Presentational Pattern

- Container → logic, API, state
- Presentational → UI only

---

### 5. Context + Reducer

Use for:

- Auth
- Theme
- Notifications

Avoid prop drilling beyond 2 levels.

---

## :zap: Code Splitting

- Use `React.lazy()` for all routes
- Lazy load heavy components

```jsx
const Dashboard = React.lazy(() => import("@modules/dashboard/components/dashboard"));
```

---

## :card_index_dividers: Project Structure

### Frontend

```
src/
├── app/
├── components/
├── modules/
├── constants/
├── utils/
├── hooks/
├── lib/
└── styles/
```

---

## :arrows_counterclockwise: CRUD State Handling (Required)

Every UI must handle:

- Loading
- Error
- Empty
- Success

```jsx
if (loading) return <TableSkeleton />;
if (error) return <ErrorState />;
if (!data.length) return <EmptyState />;

return <DataTable data={data} />;
```

---

## :mag: Search (Debounce Required)

Never hit API on every keystroke.

```js
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value]);
  return debounced;
};
```

---

## :clipboard: Forms

Mandatory stack:

- React Hook Form
- Yup
- shadcn/ui

```js
const form = useForm({
  resolver: zodResolver(schema),
});
```

---

## :bar_chart: Data Table

Single reusable table across app.

```
components/data-table/
```

Supports:

- Sorting
- Pagination
- Filtering
- States

---

## :art: Styling Rules

- Tailwind only
- No inline styles
- No random CSS files

```jsx
<div className={cn("base", active && "active")} />
```

---

## :1234: Constants & Utils

- No cross imports
- Pure functions only

```
constants/
utils/
```

## :link: Import Aliases

Use aliases only:

```js
@components
@hooks
@utils
@constants
```

No relative imports.

---

## :broom: Code Quality

- No unnecessary comments
- ESLint + Prettier enforced
- Use:

  * Early returns
  * Clean naming

---

## :lock: Non-Negotiables

- JavaScript only
- Tailwind v4 + shadcn only
- No barrel files
- Alway use the color classes code and margin padding from the index.css file
- Debounce in search
- All CRUD states handled
- Strategy pattern where needed
- Clean architecture enforced
- Code Should be formatted
