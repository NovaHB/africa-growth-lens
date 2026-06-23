import html2canvas from 'html2canvas';

export async function downloadCard(elementId, filename) {
  const element = document.getElementById(elementId);

  // Add watermark div temporarily
  const watermark = document.createElement('div');
  watermark.style.cssText = `
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #9ca3af;
    pointer-events: none;
  `;
  watermark.innerHTML = `
    <span style="color: #f59e0b; font-weight: 700;">
      Africa Growth Lens
    </span>
    <span>·</span>
    <span>@novemhv</span>
  `;

  element.style.position = 'relative';
  element.appendChild(watermark);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
    // Keep the download button itself out of the exported image.
    ignoreElements: (el) => el.classList && el.classList.contains('card-dl-btn')
  });

  element.removeChild(watermark);

  const link = document.createElement('a');
  link.download = `${filename}-africa-growth-lens.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
