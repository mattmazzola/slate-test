const value = {
  "document": {
    "nodes": [
      {
        "kind": "block",
        "type": "paragraph",
        "nodes": [
          {
            "kind": "text",
            "leaves": [
              {
                "text": "Try it out yourself! Just "
              },
              {
                "text": "select any piece of text and the menu will appear",
                "marks": [
                  {
                    "type": "bold"
                  },
                  {
                    "type": "italic"
                  }
                ]
              },
              {
                "text": "    "
              }
            ]
          },
          {
              "kind": "inline",
              "type": "custom_inline",
              "nodes": [
                {
                    "kind": "text",
                    "leaves": [
                      {
                        "text": "Inline Node with Text"
                      }
                    ]
                  }
              ]
          }
        ]
      }
    ]
  }
}

export default value