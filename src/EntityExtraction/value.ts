const value = {
    "document": {
        "nodes": [
            {
                "kind": "block",
                "type": "paragraph",
                "isVoid": false,
                "data": {},
                "nodes": [
                    {
                        "kind": "text",
                        "leaves": [
                            {
                                "kind": "leaf",
                                "text": "Test ",
                                "marks": []
                            }
                        ]
                    },
                    {
                        "kind": "inline",
                        "type": "custom-inline-node",
                        "isVoid": false,
                        "data": {
                            "foo": "bar"
                        },
                        "nodes": [
                            {
                                "kind": "text",
                                "leaves": [
                                    {
                                        "kind": "leaf",
                                        "text": "Hey",
                                        "marks": []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "kind": "text",
                        "leaves": [
                            {
                                "kind": "leaf",
                                "text": " Test",
                                "marks": []
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

/*
{
    "kind": "document",
    "data": {},
    "nodes": [
      {
        "kind": "block",
        "type": "paragraph",
        "isVoid": false,
        "data": {},
        "nodes": [
          {
            "kind": "text",
            "leaves": [
              {
                "kind": "leaf",
                "text": "Test ",
                "marks": []
              }
            ]
          },
          {
            "kind": "inline",
            "type": "custom-inline-node",
            "isVoid": false,
            "data": {
              "foo": "bar"
            },
            "nodes": [
              {
                "kind": "text",
                "leaves": [
                  {
                    "kind": "leaf",
                    "text": "Hey",
                    "marks": []
                  }
                ]
              }
            ]
          },
          {
            "kind": "text",
            "leaves": [
              {
                "kind": "leaf",
                "text": " Test",
                "marks": []
              }
            ]
          }
        ]
      }
    ]
  }

  */

export default value