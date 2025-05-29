
// export const getAllEmployees = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       sortBy = "createdAt",  // or any default sort field
//       sortOrder = "desc",
//       search,
//     } = req.query as {
//       page?: string;
//       limit?: string;
//       sortBy?: string;
//       sortOrder?: string;
//       search?: string;
//     };

//     // Build query object
//     const query: any = {};

//     // If there's a search term, match it against these fields (case-insensitive)
//     if (search) {
//       query.$or = [
//         { employeename: { $regex: search, $options: "i" } },
//         { role: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { address: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Sorting
//     const sortOption: any = {};
//     sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;

//     // Pagination
//     const skip = (Number(page) - 1) * Number(limit);
//     const employees = await Employee.find(query)
//       .select("-password")
//       .sort(sortOption)
//       .skip(skip)
//       .limit(parseInt(limit));

//     if (!employees || employees.length === 0) {
//       apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_FOUND);
//       return;
//     }

//     const total = await Employee.countDocuments(query);

//     apiResponse(res, StatusCodes.OK, messages.EMPLOYEE_FETCHED, {
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       employees,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };

// export const getAllEmployees = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const page = Number(req.query.page as string) || 1;
//     const limit = Number(req.query.limit as string) || 10;
//     const skip = (page - 1) * limit;

//     // Sorting query params
//     const sortBy = (req.query.sortBy as string) || 'createdAt'; // default field
//     const order = (req.query.order as string) === 'asc' ? 1 : -1; // asc or desc

//     const employees = await Employee.find()
//       .select("-password")
//       .sort({ [sortBy]: order }) // apply sorting
//       .skip(skip)
//       .limit(limit);

//     if (!employees || employees.length === 0) {
//       apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_FOUND);
//       return;
//     }

//     const count = await Employee.countDocuments();
//     const totalPages = Math.ceil(count / limit);

//     apiResponse(res, StatusCodes.OK, messages.EMPLOYEE_FETCHED, {
//       employees,
//       count,
//       totalPages,
//     });
//   } catch (error) {
//     handleError(res, error);
//   }
// };
export const getAllEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page as string) || 1;
    const limit = Number(req.query.limit as string) || 10; // ✅ Fix here
    const skip = (page - 1) * limit;

    const { sortBy = "employeeName", sortOrder = "asc", search } = req.query as {
      sortBy?: string;
      sortOrder?: string;
      search?: string;
    };

    const query: any = {};
    if (search) {
      query.$or = [
        { employeeName: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption: Record<string, number> = {};
    sortOption[sortBy] = sortOrder.toLowerCase() === "asc" ? 1 : -1;

    const employees = await Employee.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort(sortOption) // ✅ Use dynamic sorting
      .exec();

    if (!employees || employees.length === 0) {
      apiResponse(res, StatusCodes.NOT_FOUND, messages.EMPLOYEE_NOT_FOUND);
      return;
    }

    const count = await Employee.countDocuments(query); // ✅ Filtered count
    const totalPages = Math.ceil(count / limit);

    apiResponse(res, StatusCodes.OK, messages.EMPLOYEE_FETCHED, {
      employees,
      count,
      totalPages,
    });
  } catch (error) {
    handleError(res, error);
  }
};
