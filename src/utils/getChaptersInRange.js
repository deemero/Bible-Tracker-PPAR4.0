export function getChaptersInRange(startBook, startChapter, endBook, endChapter, bibleBooks) {
    const flatChapters = bibleBooks.flatMap(section =>
      section.books.map(book => ({
        name: book.name,
        chapters: book.chapters,
      }))
    );
  
    let collecting = false;
    let totalChapters = 0;
  
    for (const book of flatChapters) {
      if (book.name === startBook) collecting = true;
  
      if (collecting) {
        const isStart = book.name === startBook;
        const isEnd = book.name === endBook;
  
        let start = isStart ? startChapter : 1;
        let end = isEnd ? endChapter : book.chapters;
  
        totalChapters += Math.max(end - start + 1, 0);
      }
  
      if (book.name === endBook) break;
    }
  
    return totalChapters;
  }
  