exports['nlcst-pattern-match parse-replace 1'] = [
  {
    "type": "WordNode",
    "children": [
      {
        "type": "TextNode",
        "value": "This",
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 5,
            "offset": 4
          }
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 1,
        "column": 5,
        "offset": 4
      }
    },
    "data": {
      "pos": "DT"
    }
  },
  {
    "type": "WhiteSpaceNode",
    "value": " ",
    "position": {
      "start": {
        "line": 1,
        "column": 5,
        "offset": 4
      },
      "end": {
        "line": 1,
        "column": 6,
        "offset": 5
      }
    }
  },
  {
    "type": "WordNode",
    "children": [
      {
        "type": "TextNode",
        "value": "is",
        "position": {
          "start": {
            "line": 1,
            "column": 6,
            "offset": 5
          },
          "end": {
            "line": 1,
            "column": 8,
            "offset": 7
          }
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 6,
        "offset": 5
      },
      "end": {
        "line": 1,
        "column": 8,
        "offset": 7
      }
    },
    "data": {
      "pos": "VBZ"
    }
  },
  {
    "type": "WhiteSpaceNode",
    "value": " ",
    "position": {
      "start": {
        "line": 1,
        "column": 8,
        "offset": 7
      },
      "end": {
        "line": 1,
        "column": 9,
        "offset": 8
      }
    }
  },
  {
    "type": "WordNode",
    "position": {
      "start": {
        "line": 1,
        "column": 9,
        "offset": 8
      },
      "end": {
        "line": 1,
        "column": 14,
        "offset": 13
      }
    }
  },
  {
    "type": "PunctuationNode",
    "value": ".",
    "position": {
      "start": {
        "line": 1,
        "column": 14,
        "offset": 13
      },
      "end": {
        "line": 1,
        "column": 15,
        "offset": 14
      }
    },
    "data": {
      "pos": "."
    }
  }
]

exports['nlcst-pattern-match #match match japanese parser 1'] = [
  {
    "type": "WordNode",
    "data": {
      "pos": "\u52D5\u8A5E",
      "pos_detail_1": "\u81EA\u7ACB"
    },
    "position": {
      "start": {
        "line": 1,
        "column": 1,
        "offset": 0
      },
      "end": {
        "line": 1,
        "column": 6,
        "offset": 5
      }
    }
  },
  {
    "type": "WordNode",
    "children": [
      {
        "type": "TextNode",
        "value": "\u305F\u308A",
        "position": {
          "start": {
            "line": 1,
            "column": 6,
            "offset": 5
          },
          "end": {
            "line": 1,
            "column": 8,
            "offset": 7
          }
        },
        "data": {
          "word_id": 92960,
          "word_type": "KNOWN",
          "surface_form": "\u305F\u308A",
          "pos": "\u52A9\u8A5E",
          "pos_detail_1": "\u4E26\u7ACB\u52A9\u8A5E",
          "pos_detail_2": "*",
          "pos_detail_3": "*",
          "conjugated_type": "*",
          "conjugated_form": "*",
          "basic_form": "\u305F\u308A",
          "reading": "\u30BF\u30EA",
          "pronunciation": "\u30BF\u30EA"
        }
      }
    ],
    "position": {
      "start": {
        "line": 1,
        "column": 6,
        "offset": 5
      },
      "end": {
        "line": 1,
        "column": 8,
        "offset": 7
      }
    },
    "data": {
      "word_id": 92960,
      "word_type": "KNOWN",
      "surface_form": "\u305F\u308A",
      "pos": "\u52A9\u8A5E",
      "pos_detail_1": "\u4E26\u7ACB\u52A9\u8A5E",
      "pos_detail_2": "*",
      "pos_detail_3": "*",
      "conjugated_type": "*",
      "conjugated_form": "*",
      "basic_form": "\u305F\u308A",
      "reading": "\u30BF\u30EA",
      "pronunciation": "\u30BF\u30EA"
    }
  }
]

exports['nlcst-pattern-match #match should return MatchResult[] 1'] = {
  "text": "Bob does it.",
  "position": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 1,
      "column": 13,
      "offset": 12
    },
    "index": 0
  },
  "nodeList": [
    {
      "type": "WordNode",
      "children": [
        {
          "type": "TextNode",
          "value": "Bob",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 4,
              "offset": 3
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 4,
          "offset": 3
        }
      },
      "data": {
        "pos": "NNP"
      }
    },
    {
      "type": "WhiteSpaceNode",
      "value": " ",
      "position": {
        "start": {
          "line": 1,
          "column": 4,
          "offset": 3
        },
        "end": {
          "line": 1,
          "column": 5,
          "offset": 4
        }
      }
    },
    {
      "type": "WordNode",
      "children": [
        {
          "type": "TextNode",
          "value": "does",
          "position": {
            "start": {
              "line": 1,
              "column": 5,
              "offset": 4
            },
            "end": {
              "line": 1,
              "column": 9,
              "offset": 8
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 5,
          "offset": 4
        },
        "end": {
          "line": 1,
          "column": 9,
          "offset": 8
        }
      },
      "data": {
        "pos": "VBZ"
      }
    },
    {
      "type": "WhiteSpaceNode",
      "value": " ",
      "position": {
        "start": {
          "line": 1,
          "column": 9,
          "offset": 8
        },
        "end": {
          "line": 1,
          "column": 10,
          "offset": 9
        }
      }
    },
    {
      "type": "WordNode",
      "children": [
        {
          "type": "TextNode",
          "value": "it",
          "position": {
            "start": {
              "line": 1,
              "column": 10,
              "offset": 9
            },
            "end": {
              "line": 1,
              "column": 12,
              "offset": 11
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 10,
          "offset": 9
        },
        "end": {
          "line": 1,
          "column": 12,
          "offset": 11
        }
      },
      "data": {
        "pos": "PRP"
      }
    },
    {
      "type": "PunctuationNode",
      "value": ".",
      "position": {
        "start": {
          "line": 1,
          "column": 12,
          "offset": 11
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        }
      },
      "data": {
        "pos": "."
      }
    }
  ]
}

exports['nlcst-pattern-match #matchCST should return MatchCSTResult[] 1'] = {
  "position": {
    "start": {
      "line": 1,
      "column": 1,
      "offset": 0
    },
    "end": {
      "line": 1,
      "column": 13,
      "offset": 12
    },
    "index": 0
  },
  "nodeList": [
    {
      "type": "WordNode",
      "children": [
        {
          "type": "TextNode",
          "value": "Bob",
          "position": {
            "start": {
              "line": 1,
              "column": 1,
              "offset": 0
            },
            "end": {
              "line": 1,
              "column": 4,
              "offset": 3
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 1,
          "offset": 0
        },
        "end": {
          "line": 1,
          "column": 4,
          "offset": 3
        }
      },
      "data": {
        "pos": "NNP"
      }
    },
    {
      "type": "WhiteSpaceNode",
      "value": " ",
      "position": {
        "start": {
          "line": 1,
          "column": 4,
          "offset": 3
        },
        "end": {
          "line": 1,
          "column": 5,
          "offset": 4
        }
      }
    },
    {
      "type": "WordNode",
      "children": [
        {
          "type": "TextNode",
          "value": "does",
          "position": {
            "start": {
              "line": 1,
              "column": 5,
              "offset": 4
            },
            "end": {
              "line": 1,
              "column": 9,
              "offset": 8
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 5,
          "offset": 4
        },
        "end": {
          "line": 1,
          "column": 9,
          "offset": 8
        }
      },
      "data": {
        "pos": "VBZ"
      }
    },
    {
      "type": "WhiteSpaceNode",
      "value": " ",
      "position": {
        "start": {
          "line": 1,
          "column": 9,
          "offset": 8
        },
        "end": {
          "line": 1,
          "column": 10,
          "offset": 9
        }
      }
    },
    {
      "type": "WordNode",
      "children": [
        {
          "type": "TextNode",
          "value": "it",
          "position": {
            "start": {
              "line": 1,
              "column": 10,
              "offset": 9
            },
            "end": {
              "line": 1,
              "column": 12,
              "offset": 11
            }
          }
        }
      ],
      "position": {
        "start": {
          "line": 1,
          "column": 10,
          "offset": 9
        },
        "end": {
          "line": 1,
          "column": 12,
          "offset": 11
        }
      },
      "data": {
        "pos": "PRP"
      }
    },
    {
      "type": "PunctuationNode",
      "value": ".",
      "position": {
        "start": {
          "line": 1,
          "column": 12,
          "offset": 11
        },
        "end": {
          "line": 1,
          "column": 13,
          "offset": 12
        }
      },
      "data": {
        "pos": "."
      }
    }
  ]
}
