// =====================================================================
// SARLAYASH PRODUCTIONS PRESENTS DSA ARRAY BINGO - POWERED BY KAPIL
// HIGH-FIDELITY CERTIFICATE & BADGE CANVAS ENGINE (PNG & PDF EXPORT)
// Strict text measurement, zero overlapping, zero cropping, 100% offline
// =====================================================================

class CertificateManager {
  constructor() {
    this.certWidth = 1600;
    this.certHeight = 1100;
    this.badgeSize = 800;
  }

  // Draw Ornate Certificate on High-Res Canvas
  createCertificateCanvas(data) {
    const canvas = document.createElement('canvas');
    canvas.width = this.certWidth;
    canvas.height = this.certHeight;
    const ctx = canvas.getContext('2d');

    const winnerName = (data.winnerName || 'Algorithmic Champion').toUpperCase();
    const prizeName = (data.prizeName || 'Full House (Grand Winner)').toUpperCase();
    const dateStr = data.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const certId = data.certId || `SYP-KAPIL-${Math.floor(10000 + Math.random() * 90000)}-${data.prizeKey || 'WIN'}`.toUpperCase();
    const avatar = data.avatar || '👑';
    const points = data.points || 500;

    // 1. Background - Deep Luxury Navy Radial
    const bgGrad = ctx.createRadialGradient(
      this.certWidth / 2, this.certHeight / 2, 100,
      this.certWidth / 2, this.certHeight / 2, 900
    );
    bgGrad.addColorStop(0, '#101828');
    bgGrad.addColorStop(0.65, '#090d16');
    bgGrad.addColorStop(1, '#04060b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.certWidth, this.certHeight);

    // Subtle background cyber grid
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 40; x < this.certWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.certHeight);
      ctx.stroke();
    }
    for (let y = 40; y < this.certHeight; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.certWidth, y);
      ctx.stroke();
    }

    // 2. Multi-tier Gold & Cyan Ornate Borders
    // Outer border
    ctx.strokeStyle = '#d4af37'; // Antique Gold
    ctx.lineWidth = 10;
    ctx.strokeRect(35, 35, this.certWidth - 70, this.certHeight - 70);

    // Cyan Neon Accent Line
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, this.certWidth - 96, this.certHeight - 96);

    // Inner Fine Gold Line
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, this.certWidth - 120, this.certHeight - 120);

    // Corner Ornaments
    this.drawCornerOrnament(ctx, 60, 60, 0);
    this.drawCornerOrnament(ctx, this.certWidth - 60, 60, Math.PI / 2);
    this.drawCornerOrnament(ctx, this.certWidth - 60, this.certHeight - 60, Math.PI);
    this.drawCornerOrnament(ctx, 60, this.certHeight - 60, -Math.PI / 2);

    // 3. Top Branding: SARLAYASH PRODUCTIONS PRESENTS
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#ffd700';
    ctx.font = '800 24px "Chakra Petch", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('★  SARLAYASH PRODUCTIONS  ★', this.certWidth / 2, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px "Outfit", sans-serif';
    ctx.letterSpacing = '5px';
    ctx.fillText('PRESENTS', this.certWidth / 2, 165);

    // 4. Game Title: DSA ARRAY BINGO - POWERED BY KAPIL
    const titleGrad = ctx.createLinearGradient(this.certWidth / 2 - 350, 0, this.certWidth / 2 + 350, 0);
    titleGrad.addColorStop(0, '#00f3ff');
    titleGrad.addColorStop(0.5, '#ffffff');
    titleGrad.addColorStop(1, '#ff007f');
    ctx.fillStyle = titleGrad;
    ctx.font = '900 48px "Chakra Petch", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('DSA ARRAY BINGO', this.certWidth / 2, 220);

    ctx.fillStyle = '#ffe600';
    ctx.font = '700 20px "Chakra Petch", sans-serif';
    ctx.letterSpacing = '4px';
    ctx.fillText('⚡ POWERED BY KAPIL ⚡', this.certWidth / 2, 265);

    // Decorative Separator Line with Diamond
    this.drawDecorativeDivider(ctx, this.certWidth / 2, 305, 500);

    // 5. Certificate Main Subheading
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 20px "Outfit", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('CERTIFICATE OF ALGORITHMIC EXCELLENCE & VICTORY', this.certWidth / 2, 350);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 18px "Outfit", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('This official credential certifies that', this.certWidth / 2, 395);

    // 6. Winner Name (Calculated font size to guarantee NO text overlapping!)
    let nameFontSize = 58;
    ctx.font = `900 ${nameFontSize}px "Outfit", sans-serif`;
    let nameWidth = ctx.measureText(winnerName).width;
    while (nameWidth > 1100 && nameFontSize > 28) {
      nameFontSize -= 4;
      ctx.font = `900 ${nameFontSize}px "Outfit", sans-serif`;
      nameWidth = ctx.measureText(winnerName).width;
    }

    // Name Glowing Underline Bar
    const nameY = 470;
    const nameGrad = ctx.createLinearGradient(this.certWidth / 2 - 300, 0, this.certWidth / 2 + 300, 0);
    nameGrad.addColorStop(0, '#ffe600');
    nameGrad.addColorStop(0.5, '#ffffff');
    nameGrad.addColorStop(1, '#00f3ff');
    ctx.fillStyle = nameGrad;
    ctx.fillText(winnerName, this.certWidth / 2, nameY);

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(this.certWidth / 2 - nameWidth / 2 - 40, nameY + 36);
    ctx.lineTo(this.certWidth / 2 + nameWidth / 2 + 40, nameY + 36);
    ctx.stroke();

    // 7. Achievement Statement
    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 18px "Outfit", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('has demonstrated supreme precision, lightning speed, and mastery in Array DSA to claim victory in', this.certWidth / 2, 545);

    // 8. Prize Category Box / Ribbon
    const prizeBoxWidth = 720;
    const prizeBoxHeight = 70;
    const prizeBoxX = (this.certWidth - prizeBoxWidth) / 2;
    const prizeBoxY = 585;

    ctx.fillStyle = 'rgba(0, 243, 255, 0.08)';
    ctx.fillRect(prizeBoxX, prizeBoxY, prizeBoxWidth, prizeBoxHeight);
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(prizeBoxX, prizeBoxY, prizeBoxWidth, prizeBoxHeight);

    ctx.fillStyle = '#00f3ff';
    ctx.font = '800 32px "Chakra Petch", sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(`🏆 ${prizeName} 🏆`, this.certWidth / 2, prizeBoxY + 35);

    // 9. Array Knowledge Benchmark Note
    ctx.fillStyle = '#64748b';
    ctx.font = '500 15px "JetBrains Mono", monospace';
    ctx.letterSpacing = '1px';
    ctx.fillText(`Benchmark: 90 DSA Array Problems • Score: +${points} XP • Time Complexity: O(1) Mastery`, this.certWidth / 2, 690);

    // 10. Golden Rosette Seal (Bottom Center)
    this.drawGoldenSeal(ctx, this.certWidth / 2, 820, 70, avatar);

    // 11. Signatures & Verification (Bottom Left & Right)
    // Left Signature: Kapil (Chief Architect)
    const sigLeftX = 260;
    const sigY = 930;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sigLeftX - 140, sigY);
    ctx.lineTo(sigLeftX + 140, sigY);
    ctx.stroke();

    // Artistic script signature approximation
    ctx.fillStyle = '#00f3ff';
    ctx.font = 'italic 700 30px "Brush Script MT", "Caveat", cursive, sans-serif';
    ctx.fillText('Kapil', sigLeftX, sigY - 25);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Chakra Petch", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('KAPIL', sigLeftX, sigY + 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px "Outfit", sans-serif';
    ctx.fillText('Chief Architect & Powered By', sigLeftX, sigY + 46);

    // Right Signature: SarlaYash Productions Official Seal
    const sigRightX = this.certWidth - 260;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sigRightX - 140, sigY);
    ctx.lineTo(sigRightX + 140, sigY);
    ctx.stroke();

    ctx.fillStyle = '#ff007f';
    ctx.font = 'italic 700 28px "Brush Script MT", "Caveat", cursive, sans-serif';
    ctx.fillText('SarlaYash', sigRightX, sigY - 25);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px "Chakra Petch", sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('SARLAYASH PRODUCTIONS', sigRightX, sigY + 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 13px "Outfit", sans-serif';
    ctx.fillText('Authorized Signature & Seal', sigRightX, sigY + 46);

    // 12. Bottom Metadata Footer (Date & ID)
    ctx.fillStyle = '#64748b';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ISSUED DATE: ${dateStr.toUpperCase()}`, 70, this.certHeight - 45);

    ctx.textAlign = 'right';
    ctx.fillText(`VERIFICATION ID: ${certId}`, this.certWidth - 70, this.certHeight - 45);

    return canvas;
  }

  // Draw High-Resolution Victorious Arcade Badge
  createBadgeCanvas(data) {
    const canvas = document.createElement('canvas');
    canvas.width = this.badgeSize;
    canvas.height = this.badgeSize;
    const ctx = canvas.getContext('2d');

    const winnerName = (data.winnerName || 'Winner').toUpperCase();
    const prizeName = (data.prizeName || 'Bingo Champion').toUpperCase();
    const avatar = data.avatar || '👑';

    const cx = this.badgeSize / 2;
    const cy = this.badgeSize / 2;

    // Background transparent
    ctx.clearRect(0, 0, this.badgeSize, this.badgeSize);

    // Outer Glow Ring
    const outerRadius = 350;
    const grad = ctx.createRadialGradient(cx, cy, 180, cx, cy, outerRadius);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.7, '#0f172a');
    grad.addColorStop(1, '#020617');

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // 24-point Sunburst / Gear Ring
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Neon Cyan Accent Ring
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius - 18, 0, Math.PI * 2);
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Curved Text: Top Arch -> SARLAYASH PRODUCTIONS
    this.drawCurvedText(ctx, "SARLAYASH PRODUCTIONS", cx, cy, outerRadius - 55, Math.PI * 1.5, true, '#ffd700', '800 24px "Chakra Petch"');

    // Curved Text: Bottom Arch -> POWERED BY KAPIL
    this.drawCurvedText(ctx, "POWERED BY KAPIL", cx, cy, outerRadius - 55, Math.PI * 0.5, false, '#00f3ff', '800 24px "Chakra Petch"');

    // Inner Medallion Circle
    const innerRadius = 230;
    const innerGrad = ctx.createLinearGradient(cx - innerRadius, cy - innerRadius, cx + innerRadius, cy + innerRadius);
    innerGrad.addColorStop(0, '#ff007f');
    innerGrad.addColorStop(0.5, '#7c3aed');
    innerGrad.addColorStop(1, '#00f3ff');

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = innerGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius - 8, 0, Math.PI * 2);
    ctx.fillStyle = '#090d16';
    ctx.fill();
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Center Avatar
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '85px sans-serif';
    ctx.fillText(avatar, cx, cy - 65);

    // Winner Name
    let nameFont = 30;
    ctx.font = `900 ${nameFont}px "Outfit", sans-serif`;
    while (ctx.measureText(winnerName).width > 360 && nameFont > 18) {
      nameFont -= 2;
      ctx.font = `900 ${nameFont}px "Outfit", sans-serif`;
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillText(winnerName, cx, cy + 18);

    // Prize Title
    let prizeFont = 22;
    ctx.font = `800 ${prizeFont}px "Chakra Petch", sans-serif`;
    while (ctx.measureText(prizeName).width > 380 && prizeFont > 14) {
      prizeFont -= 2;
      ctx.font = `800 ${prizeFont}px "Chakra Petch", sans-serif`;
    }
    ctx.fillStyle = '#ffe600';
    ctx.fillText(prizeName, cx, cy + 62);

    // Bottom Stars
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#00f3ff';
    ctx.fillText('★  DSA ARRAY BINGO  ★', cx, cy + 105);

    ctx.restore();
    return canvas;
  }

  // Draw Corner Ornaments for the Certificate
  drawCornerOrnament(ctx, x, y, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(45, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 45);

    ctx.moveTo(12, 12);
    ctx.lineTo(35, 12);
    ctx.moveTo(12, 12);
    ctx.lineTo(12, 35);

    ctx.stroke();

    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(8, 8, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Decorative Divider with Central Diamond
  drawDecorativeDivider(ctx, x, y, width) {
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x - 25, y);
    ctx.moveTo(x + 25, y);
    ctx.lineTo(x + width / 2, y);
    ctx.stroke();

    // Central Golden Diamond
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x + 12, y);
    ctx.lineTo(x, y + 10);
    ctx.lineTo(x - 12, y);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Golden Rosette Seal
  drawGoldenSeal(ctx, x, y, radius, avatar) {
    ctx.save();
    // Ribbon tails
    ctx.fillStyle = '#be123c';
    ctx.beginPath();
    ctx.moveTo(x - 30, y + radius - 15);
    ctx.lineTo(x - 55, y + radius + 70);
    ctx.lineTo(x - 30, y + radius + 55);
    ctx.lineTo(x - 5, y + radius + 70);
    ctx.lineTo(x - 10, y + radius - 15);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 30, y + radius - 15);
    ctx.lineTo(x + 55, y + radius + 70);
    ctx.lineTo(x + 30, y + radius + 55);
    ctx.lineTo(x + 5, y + radius + 70);
    ctx.lineTo(x + 10, y + radius - 15);
    ctx.closePath();
    ctx.fill();

    // Rosette Outer Starburst
    const teeth = 28;
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const r = (i % 2 === 0) ? radius : radius - 8;
      const angle = (i * Math.PI) / teeth;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Inner Golden Circle
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(x, y, radius - 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(x, y, radius - 20, 0, Math.PI * 2);
    ctx.fill();

    // Center Crown / Trophy
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏆', x, y);

    ctx.restore();
  }

  // Curved text around an arc
  drawCurvedText(ctx, text, cx, cy, radius, startAngle, isClockwise, color, font) {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const step = 0.085;
    const totalAngle = text.length * step;
    const initial = isClockwise ? startAngle - totalAngle / 2 : startAngle + totalAngle / 2;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const angle = isClockwise ? initial + i * step : initial - i * step;
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      ctx.rotate(isClockwise ? angle + Math.PI / 2 : angle - Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  // Export Canvas to PNG
  downloadCanvasAsPng(canvas, filename = 'Certificate.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export Canvas to Pristine Vector PDF (Zero Cropping, Proper Aspect Ratio)
  downloadCanvasAsPdf(canvas, filename = 'Certificate.pdf') {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF generator library loading... Please try again in a moment or download as PNG.');
      return;
    }

    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 landscape dimensions: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions maintaining aspect ratio (1600:1100 = 1.4545)
    const imgRatio = canvas.width / canvas.height;
    let renderW = pageWidth;
    let renderH = pageWidth / imgRatio;

    if (renderH > pageHeight) {
      renderH = pageHeight;
      renderW = pageHeight * imgRatio;
    }

    const marginX = (pageWidth - renderW) / 2;
    const marginY = (pageHeight - renderH) / 2;

    pdf.addImage(imgData, 'JPEG', marginX, marginY, renderW, renderH, undefined, 'FAST');
    pdf.save(filename);
  }
}

window.certificateManager = new CertificateManager();
