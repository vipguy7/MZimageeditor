export const loadFont = (fontName: string, fontUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.fonts.check(`1em ${fontName}`)) {
      return resolve();
    }
    const font = new FontFace(fontName, `url(${fontUrl})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        resolve();
      })
      .catch((error) => {
        console.error(`Failed to load font: ${fontName}`, error);
        reject(error);
      });
  });
};
