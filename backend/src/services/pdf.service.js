// You must have pdfkit installed: npm install pdfkit
import PDFDocument from 'pdfkit';

// Reusable helper to draw a pie chart and its corresponding legend.
function drawPieChart(doc, chartData, chartX, chartY, radius, title) {
    doc.fontSize(14).font('Helvetica-Bold').text(title, chartX - radius, chartY - radius - 20);

    const total = Object.values(chartData).reduce((sum, value) => sum + value, 0);
    if (total === 0) {
        doc.fontSize(10).font('Helvetica').text("No data available.", chartX - radius, chartY);
        return;
    }
    
    let startAngle = 0;
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    let colorIndex = 0;
    
    for (const [label, value] of Object.entries(chartData)) {
        if (value === 0) continue;

        const sliceAngle = (value / total) * 2 * Math.PI;
        const endAngle = startAngle + sliceAngle;

        doc.save()
           .moveTo(chartX, chartY)
           .arc(chartX, chartY, radius, startAngle, endAngle, false)
           .lineTo(chartX, chartY)
           .fill(colors[colorIndex % colors.length]);
        doc.restore();

        startAngle = endAngle;
        colorIndex++;
    }

    let legendY = chartY - radius;
    colorIndex = 0;
    for (const [label, value] of Object.entries(chartData)) {
        const percentage = ((value / total) * 100).toFixed(1);
        doc.rect(chartX + radius + 20, legendY, 12, 12).fill(colors[colorIndex % colors.length]);
        doc.fontSize(10).font('Helvetica').fillColor('black').text(`${label}: ${value} (${percentage}%)`, chartX + radius + 40, legendY);
        legendY += 20;
        colorIndex++;
    }
}

export function generateComplaintReportPDF(complaints, statusCounts, typeCounts, locality, res) {
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Document Header
    doc.fontSize(20).font('Helvetica-Bold').text(`Complaint Report for Locality: ${locality}`, { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(3);

    // Pie Charts Section
    drawPieChart(doc, statusCounts, 150, 220, 70, "Complaints by Status");
    drawPieChart(doc, typeCounts, 450, 220, 70, "Complaints by Type");

    doc.moveTo(50, 340).lineTo(550, 340).stroke();
    doc.moveDown(3);

    // Complaints Table Section
    doc.fontSize(16).font('Helvetica-Bold').text('Detailed Complaints List');
    doc.moveDown();

    const tableTop = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Title / Description', 50, tableTop);
    doc.text('Type', 200, tableTop);
    doc.text('Status', 300, tableTop);
    doc.text('Submitted By', 400, tableTop);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font('Helvetica');
    for (const complaint of complaints) {
        const rowY = doc.y;
        doc.text(complaint.title, 50, rowY, { width: 140 });
        doc.text(complaint.type, 200, rowY);
        doc.text(complaint.status, 300, rowY);
        doc.text(complaint.submittedBy?.fullName || 'N/A', 400, rowY, { width: 150 });
        
        doc.y = rowY;
        doc.fontSize(8).fillColor('gray').text(complaint.description.substring(0, 100) + '...', 50, doc.y + 15, { width: 140 });

        doc.moveDown(3);
        
        if (doc.y > 700) {
            doc.addPage();
        }
    }

    doc.end();
}