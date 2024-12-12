# TableExample Component

This `TableExample` component demonstrates the usage of multiple table scopes within a grid layout. It uses React, styled-components, and the `@lodado/react-namespace` library to manage state across different table instances. This implementation allows each table instance to have its own isolated scope and provides flexibility for interacting with these instances.


![simplescreenrecorder-2024-12-12_20 23 30-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/1a3bf0aa-e894-422a-9190-663d95e157c5)


## Key Features

1. **Scoped State Management:**
   - Each table is assigned a unique scope created with the `createTableUsecaseScope()` function.
   - The `ComposeProviders` component manages multiple scopes, ensuring that each table operates independently.

2. **Dynamic Configuration:**
   - The `TableConfigProvider` initializes rows and columns for each table instance.
   - The `assignmentColumns` configuration is shared across all table instances for consistent column definitions.

3. **User Interaction:**
   - Each table has an associated `AddButton` component that interacts with its specific scope.
   - The button allows users to perform actions (e.g., adding rows) scoped to the corresponding table.

4. **Custom Layouts with styled-components:**
   - `GridContainer` and `ButtonContainer` provide responsive layouts for tables and buttons.

## code explanation

### Scoped Providers

Each table is provided with its own scope for state management. The `ComposeProviders` component manages these providers:

```javascript
<ComposeProviders
  providers={[
    <TableConfigProvider scope={tableScope1.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
    <TableConfigProvider scope={tableScope2.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
    <TableConfigProvider scope={tableScope3.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
    <TableConfigProvider scope={tableScope4.__scopeTableUsecase} initRows={[]} initColumns={assignmentColumns} />,
    <TableScopeProvider value={{ table: tableScope1.__scopeTableUsecase }} />,
    <TableScopeProvider value={{ table: tableScope2.__scopeTableUsecase }} />,
    <TableScopeProvider value={{ table: tableScope3.__scopeTableUsecase }} />,
    <TableScopeProvider value={{ table: tableScope4.__scopeTableUsecase }} />,
  ]}
>
```

### Table and Button Components

The `Table` and `AddButton` components are rendered for each scope. They interact with the scoped state independently:

```javascript
<GridContainer>
  <Table scope={tableScope1.__scopeTableUsecase} />
  <Table scope={tableScope2.__scopeTableUsecase} />
  <Table scope={tableScope3.__scopeTableUsecase} />
  <Table scope={tableScope4.__scopeTableUsecase} />
</GridContainer>

<ButtonContainer>
  <div>
    Table 1 Scope. <AddButton scope={tableScope1.__scopeTableUsecase} />
  </div>
  <div>
    Table 2 Scope. <AddButton scope={tableScope2.__scopeTableUsecase} />
  </div>
  <div>
    Table 3 Scope. <AddButton scope={tableScope3.__scopeTableUsecase} />
  </div>
  <div>
    Table 4 Scope. <AddButton scope={tableScope4.__scopeTableUsecase} />
  </div>
</ButtonContainer>
```

## How It Works

1. **Scope Creation:**
   Each table has its own scope created using `createTableUsecaseScope()`. This ensures isolation between table states.

2. **Providers:**
   - `TableConfigProvider` initializes the rows and columns for each table.
   - `TableScopeProvider` makes the scope available to child components.

3. **Rendering:**
   - Tables and their respective action buttons are rendered using the grid layout.
   - Each button interacts with its corresponding table scope.

## Usage

- Clone the repository and ensure all dependencies are installed.
- Ensure the column metadata is configured in `./configs/columnMetadata.js`.
- Render the `TableExample` component in your application.

## Example Output

- Four independent tables are displayed in a grid layout.
- Each table has its own "Add" button for adding rows scoped to that table.
