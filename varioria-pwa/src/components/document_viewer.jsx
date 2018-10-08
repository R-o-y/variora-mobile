import React from 'react'


class Tabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    PDFJS.getDocument(url).then(function(pdf) {
      pdfDoc = pdf
      numPages = pdfDoc.numPages
      alert(numPages)
    })
  }

  render() {
    return (
      <div>

      </div>
    );
  }
}

export { Tabs }




