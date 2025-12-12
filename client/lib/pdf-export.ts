import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TowerSite, InspectionItem } from './supabase';

export const generateTowerPDF = async (
  tower: TowerSite,
  items: InspectionItem[],
  fileName: string = 'tower-report.pdf'
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(12, 71, 122); // Primary blue
  doc.text('LAPORAN EVALUASI MENARA BTS', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Tanggal Laporan: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, yPosition, { align: 'center' });

  // Tower Info Section
  yPosition += 20;
  doc.setFontSize(12);
  doc.setTextColor(12, 71, 122);
  doc.text('INFORMASI MENARA', 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const towerInfo = [
    [`Nomor Urut:`, `${tower.nomor_urut}`],
    [`Nama Site:`, tower.nama_site],
    [`Alamat:`, tower.alamat_site],
    [`Koordinat:`, `${tower.koordinat_lat}, ${tower.koordinat_lng}`],
    [`Tanggal Checklist:`, new Date(tower.tanggal_checklist).toLocaleDateString('id-ID')],
    [`Lokasi Site:`, tower.lokasi_site.toUpperCase()],
  ];

  towerInfo.forEach(([label, value]) => {
    doc.text(label, 25, yPosition);
    doc.text(String(value), 70, yPosition);
    yPosition += 7;
  });

  // Inspection Items Section
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(12, 71, 122);
  doc.text('HASIL CHECKLIST EVALUASI', 20, yPosition);

  yPosition += 10;
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  // Table headers
  const tableStartY = yPosition;
  const col1 = 25;
  const col2 = 100;
  const col3 = 150;
  const col4 = 185;
  const rowHeight = 8;

  doc.setFillColor(12, 71, 122);
  doc.setTextColor(255, 255, 255);
  doc.rect(20, tableStartY - 5, pageWidth - 40, 6, 'F');
  doc.text('No', col1, tableStartY);
  doc.text('Item', col2, tableStartY);
  doc.text('Status', col3, tableStartY);
  doc.text('Ket', col4, tableStartY);

  yPosition = tableStartY + 6;
  doc.setTextColor(0, 0, 0);

  // Get status counts
  const stats = {
    baik: items.filter(i => i.status === 'baik').length,
    sedang: items.filter(i => i.status === 'sedang').length,
    buruk: items.filter(i => i.status === 'buruk').length,
  };

  let pageNum = 1;

  items.forEach((item, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
      pageNum += 1;
    }

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(20, yPosition - 4, pageWidth - 40, rowHeight, 'F');
    }

    // Status color coding
    let statusColor = [0, 0, 0];
    if (item.status === 'baik') statusColor = [34, 197, 94]; // Green
    if (item.status === 'sedang') statusColor = [234, 179, 8]; // Yellow
    if (item.status === 'buruk') statusColor = [239, 68, 68]; // Red

    doc.setTextColor(...statusColor);
    doc.text(String(item.item_number), col1, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(item.item_name.substring(0, 50), col2, yPosition);
    doc.setTextColor(...statusColor);
    doc.text(item.status ? item.status.toUpperCase() : '-', col3, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.text(item.keterangan ? item.keterangan.substring(0, 20) : '-', col4, yPosition);

    yPosition += rowHeight;
  });

  // Summary Section
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
    pageNum += 1;
  }

  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(12, 71, 122);
  doc.text('RINGKASAN EVALUASI', 20, yPosition);

  yPosition += 10;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const summaryData = [
    [`Total Item Dievaluasi:`, `${items.length}`],
    [`Kondisi Baik (✓):`, `${stats.baik} item (${((stats.baik / items.length) * 100).toFixed(1)}%)`],
    [`Kondisi Sedang (⚠):`, `${stats.sedang} item (${((stats.sedang / items.length) * 100).toFixed(1)}%)`],
    [`Kondisi Buruk (✗):`, `${stats.buruk} item (${((stats.buruk / items.length) * 100).toFixed(1)}%)`],
  ];

  summaryData.forEach(([label, value]) => {
    doc.text(label, 25, yPosition);
    doc.text(value, 100, yPosition);
    yPosition += 7;
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated: ${new Date().toLocaleString('id-ID')} | Page ${pageNum}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Save PDF
  doc.save(fileName);
};

export const generateTowerReportHTML = (
  tower: TowerSite,
  items: InspectionItem[]
): string => {
  const stats = {
    baik: items.filter(i => i.status === 'baik').length,
    sedang: items.filter(i => i.status === 'sedang').length,
    buruk: items.filter(i => i.status === 'buruk').length,
  };

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto;">
      <h1 style="text-align: center; color: #0c477a;">LAPORAN EVALUASI MENARA BTS</h1>
      <p style="text-align: center; color: #666; font-size: 12px;">
        Tanggal Laporan: ${new Date().toLocaleDateString('id-ID')}
      </p>

      <div style="margin: 30px 0; background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0c477a;">
        <h2 style="margin-top: 0; color: #0c477a;">INFORMASI MENARA</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 25%;">Nomor Urut:</td>
            <td style="padding: 8px;">${tower.nomor_urut}</td>
            <td style="padding: 8px; font-weight: bold; width: 25%;">Nama Site:</td>
            <td style="padding: 8px;">${tower.nama_site}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Alamat:</td>
            <td colspan="3" style="padding: 8px;">${tower.alamat_site}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Koordinat:</td>
            <td style="padding: 8px;">${tower.koordinat_lat}, ${tower.koordinat_lng}</td>
            <td style="padding: 8px; font-weight: bold;">Tanggal Checklist:</td>
            <td style="padding: 8px;">${new Date(tower.tanggal_checklist).toLocaleDateString('id-ID')}</td>
          </tr>
        </table>
      </div>

      <div style="margin: 30px 0;">
        <h2 style="color: #0c477a;">HASIL CHECKLIST EVALUASI</h2>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background: #0c477a; color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd; width: 5%;">No</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd; width: 50%;">Item</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd; width: 15%;">Status</th>
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd; width: 30%;">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, idx) => {
              const statusColor = 
                item.status === 'baik' ? '#22c55e' :
                item.status === 'sedang' ? '#eab308' :
                item.status === 'buruk' ? '#ef4444' : '#999';
              
              const bgColor = idx % 2 === 0 ? '#f9f9f9' : '#fff';
              
              return `
                <tr style="background: ${bgColor};">
                  <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${item.item_number}</td>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.item_name}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center; color: ${statusColor}; font-weight: bold;">
                    ${item.status ? item.status.toUpperCase() : '-'}
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; font-size: 12px;">${item.keterangan || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin: 30px 0; background: #f0f9ff; padding: 20px; border-radius: 8px;">
        <h2 style="margin-top: 0; color: #0c477a;">RINGKASAN EVALUASI</h2>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div style="padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #0c477a;">
            <p style="margin: 0; color: #666; font-size: 12px;">Total Item</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #0c477a;">${items.length}</p>
          </div>
          <div style="padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #22c55e;">
            <p style="margin: 0; color: #666; font-size: 12px;">Kondisi Baik</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #22c55e;">
              ${stats.baik} (${((stats.baik / items.length) * 100).toFixed(1)}%)
            </p>
          </div>
          <div style="padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #eab308;">
            <p style="margin: 0; color: #666; font-size: 12px;">Kondisi Sedang</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #eab308;">
              ${stats.sedang} (${((stats.sedang / items.length) * 100).toFixed(1)}%)
            </p>
          </div>
          <div style="padding: 15px; background: white; border-radius: 6px; border-left: 4px solid #ef4444;">
            <p style="margin: 0; color: #666; font-size: 12px;">Kondisi Buruk</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #ef4444;">
              ${stats.buruk} (${((stats.buruk / items.length) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
        Generated: ${new Date().toLocaleString('id-ID')}
      </div>
    </div>
  `;
};
