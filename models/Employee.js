const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative']
    },
    date_of_joining: {
      type: Date,
      required: [true, 'Date of joining is required']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An employee must have an owner (User ID)'],
      validate: {
        validator: async function (value) {
          // Verify that the referenced User actually exists in MongoDB
          const userExists = await mongoose.model('User').exists({ _id: value });
          return !!userExists;
        },
        message: 'The owner must reference an existing user'
      }
    }
  },
  {
    // Automatically maintains "created_at" and "updated_at"
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Compound index to optimize queries filtering by employee ID and owner
employeeSchema.index({ _id: 1, user: 1 });

// Clean up __v from JSON responses
employeeSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Employee', employeeSchema);