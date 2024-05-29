/**
 * API Error Hanlder
 *
 * @param {Error} error
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {undefined}
 */
export const apiErrorHandler = (err, req, res, next) => {

    if (err) {
        if (err.statusCode) {

            return res.status(err.statusCode).json({
                error: {
                    statusCode: err.statusCode,
                    message: err.message,
                }
            });
        } else {
            console.error(err);
            res.status(500).json({
                error: {
                    statusCode: 500,
                    message: 'Internal Server Error',
                },
            });
        }
    }
    next();
}
