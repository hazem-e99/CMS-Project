/**
 * CSV Export Utility
 * Exports survey responses to CSV format
 */

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Format survey responses for CSV export
 */
export const formatSurveyResponsesForCSV = (responses, survey) => {
  return responses.map(response => {
    const formatted = {
      'Response ID': response.id,
      'Submitted At': new Date(response.submittedAt).toLocaleString(),
    };

    // Add each answer
    response.answers.forEach((answer, index) => {
      const question = survey.questions[index];
      if (question) {
        const questionText = typeof question.question === 'object' 
          ? question.question.en 
          : question.question;
        
        let answerText = answer;
        
        // For choice questions, convert to readable text
        if (question.type === 'single-choice' && question.options) {
          const option = question.options.find(opt => opt.id === answer);
          answerText = option ? (typeof option.text === 'object' ? option.text.en : option.text) : answer;
        } else if (question.type === 'multi-choice' && Array.isArray(answer) && question.options) {
          answerText = answer.map(id => {
            const option = question.options.find(opt => opt.id === id);
            return option ? (typeof option.text === 'object' ? option.text.en : option.text) : id;
          }).join('; ');
        }
        
        formatted[questionText] = answerText;
      }
    });

    return formatted;
  });
};

