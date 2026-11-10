export async function fetchTodos() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=5",
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}
