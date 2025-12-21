import PDFDocument from 'pdfkit';


function drawPieChart(doc, chartData, chartX, chartY, radius, title) {
  // Position the title above the chart and center it
  const titleWidth = radius * 2 + 40;
  const titleX = chartX - radius;
  const titleY = chartY - radius - 35;
  doc.fontSize(14).font('Helvetica-Bold').text(title, titleX, titleY, {
    width: titleWidth,
    align: 'center',
  });

  // Filter out invalid values and ensure they're numbers
  const validData = {};
  for (const [label, value] of Object.entries(chartData)) {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue > 0) {
      validData[label] = numValue;
    }
  }

  const total = Object.values(validData).reduce((sum, value) => sum + value, 0);
  if (total === 0) {
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('No data available.', chartX - radius, chartY);
    return;
  }

  let startAngle = 0;
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  let colorIndex = 0;

  for (const [label, value] of Object.entries(validData)) {
    const sliceAngle = (value / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    doc
      .save()
      .moveTo(chartX, chartY)
      .arc(chartX, chartY, radius, startAngle, endAngle, false)
      .lineTo(chartX, chartY)
      .fill(colors[colorIndex % colors.length]);
    doc.restore();
    startAngle = endAngle;
    colorIndex++;
  }

  // Position the legend clearly to the right of the chart
  const legendStartX = chartX + radius + 20;
  let legendY = chartY - radius;
  colorIndex = 0;
  for (const [label, value] of Object.entries(validData)) {
    const percentage = ((value / total) * 100).toFixed(1);
    doc
      .rect(legendStartX, legendY, 12, 12)
      .fill(colors[colorIndex % colors.length]);
    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('black')
      .text(`${label}: ${value} (${percentage}%)`, legendStartX + 20, legendY);
    legendY += 20;
    colorIndex++;
  }
}



export function generateComplaintReportPDF(
  complaints,
  statusCounts,
  typeCounts,
  pinCode,
  state,
  res
) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      // Collect PDF data in buffers instead of piping directly to response
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        // Headers are already set in the controller
        res.end(pdfBuffer);
        resolve();
      });
      doc.on('error', (err) => {
        console.error('PDF Document Error:', err);
        reject(err);
      });

  // Document Header
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(`Complaint Report`, { align: 'center' });
    doc.moveDown(1.5)
    if(pinCode){
      doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(`Postal Code: ${pinCode}`, { align: 'left' });
    }
    doc.moveDown(1)
    if(state){
      doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(`State: ${state}`, { align: 'left' });
    doc.moveDown(1)
    }
  doc
    .fontSize(12)
    .font('Helvetica')
    .text(`Generated on: ${new Date().toLocaleDateString()}`, {
      align: 'left',
    });
  doc.moveDown(13);

  // Pie Charts Section
  drawPieChart(doc, statusCounts, 250, 280, 70, 'Status');
  drawPieChart(doc, typeCounts, 280, 500, 70, 'Type');

  doc.moveDown(25);
  doc.x = 50;   //reset x


  // Complaints Table Section Header
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(`Detailed Complaints List`, { align: 'center' });
  doc.moveDown(2); //  Added more vertical spacing here

  // centered positions and widths for the table
  const tableTopY = doc.y;
  const tableStartX = 60;
  const columnSpacing = 15;
  const columnPositions = {
    title: tableStartX,
    type: tableStartX + 160 + columnSpacing,
    status: tableStartX + 160 + 100 + columnSpacing * 2,
    submittedBy: tableStartX + 160 + 100 + 100 + columnSpacing * 3,
  };
  const columnWidths = {
    title: 160,
    type: 100,
    status: 100,
    submittedBy: 120,
  };

  // Table Headers
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('Title / Description', columnPositions.title, tableTopY, {
    width: columnWidths.title,
  });
  doc.text('Type', columnPositions.type, tableTopY, {
    width: columnWidths.type,
  });
  doc.text('Status', columnPositions.status, tableTopY, {
    width: columnWidths.status,
  });
  doc.text('Submitted By', columnPositions.submittedBy, tableTopY, {
    width: columnWidths.submittedBy,
  });

  //single line ONLY under the header text
  const headerBottomY = doc.y;
  doc.moveTo(50, headerBottomY).lineTo(550, headerBottomY).stroke();
  doc.moveDown(1.5);
  doc.font('Helvetica');

  //  Cleaned up table drawing loop to ensure no extra lines are drawn
  for (const complaint of complaints) {
    if (doc.y > 650) {
      doc.addPage();
    }

    const rowY = doc.y;

    // main row content
    doc.text(complaint.title, columnPositions.title, rowY, {
      width: columnWidths.title,
    });
    doc.text(complaint.type, columnPositions.type, rowY, {
      width: columnWidths.type,
    });
    doc.text(complaint.status, columnPositions.status, rowY, {
      width: columnWidths.status,
    });
    doc.text(
      complaint.submittedBy?.fullName || 'N/A',
      columnPositions.submittedBy,
      rowY,
      { width: columnWidths.submittedBy }
    );

    // Calculate row height
    const mainLineHeight = Math.max(
      doc.heightOfString(complaint.title, { width: columnWidths.title }),
      doc.heightOfString(complaint.type, { width: columnWidths.type }),
      doc.heightOfString(complaint.status, { width: columnWidths.status }),
      doc.heightOfString(complaint.submittedBy?.fullName || 'N/A', {
        width: columnWidths.submittedBy,
      })
    );

    // description line
    doc.fontSize(8);
    const descriptionText = complaint.description 
      ? complaint.description.substring(0, 100) + '...' 
      : 'No description';
    const descriptionHeight = doc.heightOfString(descriptionText, {
      width: columnWidths.title,
    });
    doc
      .fillColor('gray')
      .text(descriptionText, columnPositions.title, rowY + mainLineHeight + 2, {
        width: columnWidths.title,
      });

    // Manually advance the Y cursor for the next row
    doc.y = rowY + mainLineHeight + descriptionHeight + 15;
    doc.fillColor('black').fontSize(10);
  }

      doc.end();
    } catch (err) {
      console.error('PDF Generation Error:', err);
      reject(err);
    }
  });
}
