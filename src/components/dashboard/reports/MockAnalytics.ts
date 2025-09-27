// Mock analytics data for demonstration purposes
export const MOCK_ANALYTICS = {
  overview: {
    totalReviews: 42,
    workplaceReviews: 24,
    selfReviews: 18
  },
  avgRatingsByType: {
    workplace: {
      avgRating: 3.8,
      count: 24
    },
    self: {
      avgRating: 4.2,
      count: 18
    }
  },
  departmentAnalytics: {
    'Engineering': {
      workplace: {
        avgRating: 3.9,
        count: 7
      },
      self: {
        avgRating: 4.3,
        count: 5
      }
    },
    'Marketing': {
      workplace: {
        avgRating: 3.5,
        count: 4
      },
      self: {
        avgRating: 4.0,
        count: 3
      }
    },
    'Sales': {
      workplace: {
        avgRating: 3.6,
        count: 5
      },
      self: {
        avgRating: 4.1,
        count: 4
      }
    },
    'HR': {
      workplace: {
        avgRating: 4.2,
        count: 2
      },
      self: {
        avgRating: 4.5,
        count: 2
      }
    },
    'Finance': {
      workplace: {
        avgRating: 3.7,
        count: 3
      },
      self: {
        avgRating: 4.0,
        count: 2
      }
    },
    'Product': {
      workplace: {
        avgRating: 4.0,
        count: 2
      },
      self: {
        avgRating: 4.4,
        count: 1
      }
    },
    'Design': {
      workplace: {
        avgRating: 4.1,
        count: 1
      },
      self: {
        avgRating: 4.2,
        count: 1
      }
    }
  },
  ratingDistribution: {
    workplace: {
      '1': 1,
      '2': 3,
      '3': 5,
      '4': 10,
      '5': 5
    },
    self: {
      '1': 0,
      '2': 1,
      '3': 3,
      '4': 8,
      '5': 6
    }
  },
  monthlyTrend: {
    '2025-04': {
      workplace: {
        avgRating: 3.7,
        count: 4
      },
      self: {
        avgRating: 4.0,
        count: 3
      }
    },
    '2025-05': {
      workplace: {
        avgRating: 3.8,
        count: 5
      },
      self: {
        avgRating: 4.1,
        count: 3
      }
    },
    '2025-06': {
      workplace: {
        avgRating: 3.6,
        count: 3
      },
      self: {
        avgRating: 4.2,
        count: 2
      }
    },
    '2025-07': {
      workplace: {
        avgRating: 3.9,
        count: 4
      },
      self: {
        avgRating: 4.3,
        count: 3
      }
    },
    '2025-08': {
      workplace: {
        avgRating: 4.0,
        count: 4
      },
      self: {
        avgRating: 4.4,
        count: 4
      }
    },
    '2025-09': {
      workplace: {
        avgRating: 4.1,
        count: 4
      },
      self: {
        avgRating: 4.5,
        count: 3
      }
    }
  }
};
