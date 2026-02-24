(async function() {
  OBA.renderNav('photos');
  OBA.renderFooter();

  const photoData = await OBA.getPhotos();
  const container = document.getElementById('photos-content');

  if (!photoData || photoData.length === 0) {
    container.innerHTML = '<p class="loading">No photos yet this season.</p>';
    return;
  }

  const hasAnyPhotos = photoData.some(w => w.photos && w.photos.length > 0);

  if (!hasAnyPhotos) {
    container.innerHTML = '<p class="loading">No photos yet this season.</p>';
    return;
  }

  const season = OBA.currentSeason;

  container.innerHTML = photoData
    .sort((a, b) => a.week - b.week)
    .filter(w => w.photos && w.photos.length > 0)
    .map(weekData => `
      <div class="week-group">
        <h3>Week ${weekData.week}</h3>
        <div class="photo-grid">
          ${weekData.photos.map(photo => `
            <div class="photo-card" onclick="openLightbox('images/${season}/${photo.file}', '${photo.caption.replace(/'/g, "\\'")}')">
              <img src="images/${season}/${photo.file}" alt="${photo.caption}" loading="lazy">
              <p class="photo-caption">${photo.caption}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
})();

function openLightbox(src, caption) {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-caption').textContent = caption;
  lightbox.classList.add('open');
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('lightbox').classList.remove('open');
  }
});
