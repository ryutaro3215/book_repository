import { useState } from 'react';

export const getSavedBooks = async () => {
  try {
    const res = await fetch("http://localhost:3000/books");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching saved books:", error);
    return [];
  }
};

export const isBookSaved = (book: any, savedBooks: any[]) => {
  return savedBooks.some((b: any) => b.id === book.id); 
}

export const toggleSaveBook = async (book: any, savedBooks: any[], setSavedBooks: React.Dispatch<React.SetStateAction<any[]>>, setRenderToggle: React.Dispatch<React.SetStateAction<boolean>>) => {
  const exists = savedBooks.some((b: any) => b.id === book.id);

  let updatedBooks;
  try {
  if (exists) {
      await fetch(`http://localhost:3000/books/${book.id}`, {
        method: "DELETE",
      });
      updatedBooks = savedBooks.filter((b: any) => b.id !== book.id);
    } else {
      await fetch(`http://localhost:3000/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });
      updatedBooks = [...savedBooks, book];
    }
    setSavedBooks(updatedBooks);
    setRenderToggle(prev => !prev);
  } catch (e) {
    console.error("Error toggling save book:", e);
  }
};
