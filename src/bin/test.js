import { createUser, getUsers, findUserByEmail } from "../models/User.js";

const test = async () => {
  try {
    // Test getUsers
    const users = await getUsers();
    console.log("All Users:", users);

    // Test createUser
    const newUser = await createUser(
      "John Doe",
      "john@example.com",
      "password123"
    );
    console.log("New User ID:", newUser);

    // Test findUserByEmail
    const user = await findUserByEmail("john@example.com");
    console.log("User found by email:", user);
  } catch (error) {
    console.error("Test failed:", error);
  }
};

test();
