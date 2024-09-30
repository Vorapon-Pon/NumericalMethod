#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

typedef vector<vector<double>> Matrix;

Matrix multiplyMatrices(const Matrix& A, const Matrix& B) {
    int n = A.size(), m = B[0].size(), p = A[0].size();
    Matrix result(n, vector<double>(m, 0));

    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            for (int k = 0; k < p; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

Matrix subtractMatrices(const Matrix& A, const Matrix& B) {
    int n = A.size(), m = A[0].size();
    Matrix result(n, vector<double>(m, 0));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
}

Matrix addMatrices(const Matrix& A, const Matrix& B) {
    int n = A.size(), m = A[0].size();
    Matrix result(n, vector<double>(m, 0));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            result[i][j] = A[i][j] + B[i][j];
        }
    }
    return result;
}

Matrix scalarMultiplyMatrix(const Matrix& matrix, double scalar) {
    int n = matrix.size(), m = matrix[0].size();
    Matrix result(n, vector<double>(m, 0));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            result[i][j] = matrix[i][j] * scalar;
        }
    }
    return result;
}

Matrix transposeMatrix(const Matrix& matrix) {
    int n = matrix.size(), m = matrix[0].size();
    Matrix result(m, vector<double>(n, 0));
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}

Matrix findR(const Matrix& A, const Matrix& B, const Matrix& x) {
    Matrix Ax = multiplyMatrices(A, x);
    return subtractMatrices(Ax, B);
}

Matrix findD(const Matrix& R, double alpha, const Matrix& D) {
    Matrix minusR = scalarMultiplyMatrix(R, -1);
    Matrix alphaD = scalarMultiplyMatrix(D, alpha);
    return addMatrices(minusR, alphaD);
}

double findRambda(const Matrix& A, const Matrix& D, const Matrix& R) {
    Matrix tD = transposeMatrix(D);
    Matrix DtR = multiplyMatrices(tD, R);
    Matrix DtAD = multiplyMatrices(multiplyMatrices(tD, A), D);

    double scalarDtR = DtR[0][0];
    double scalarDtAD = DtAD[0][0];

    return -scalarDtR / scalarDtAD;
}

Matrix findX(const Matrix& X, double rambda, const Matrix& D) {
    Matrix rD = scalarMultiplyMatrix(D, rambda);
    return addMatrices(X, rD);
}

double findError(const Matrix& R) {
    Matrix tR = transposeMatrix(R);
    Matrix matrixResult = multiplyMatrices(tR, R);
    return sqrt(matrixResult[0][0]);
}

double findAlpha(const Matrix& R, const Matrix& A, const Matrix& D) {
    Matrix Rt = transposeMatrix(R);
    Matrix RtAD = multiplyMatrices(multiplyMatrices(Rt, A), D);
    double scalarRtAD = RtAD[0][0];

    Matrix Dt = transposeMatrix(D);
    Matrix DtAD = multiplyMatrices(multiplyMatrices(Dt, A), D);
    double scalarDtAD = DtAD[0][0];

    return scalarRtAD / scalarDtAD;
}

Matrix conjugateGradient(Matrix A, Matrix B, Matrix X, double alpha, double rambda, Matrix D, Matrix R, int iteration) {
    rambda = findRambda(A, D, R);
    Matrix newX = findX(X, rambda, D);
    Matrix newR = findR(A, B, newX);
    double error = findError(newR);
    alpha = findAlpha(newR, A, D);
    Matrix newD = findD(newR, alpha, D);

    // Print current iteration and relevant matrices
    cout << "Iteration " << iteration << ":\n";
    cout << "  X: ";
    for (const auto& row : newX) {
        for (double val : row) {
            cout << val << " ";
        }
    }
    cout << "\n  R: ";
    for (const auto& row : newR) {
        for (double val : row) {
            cout << val << " ";
        }
    }
    cout << "\n  Error: " << error << "\n";
    cout << "  Alpha: " << alpha << "\n\n";

    if (fabs(error) < 0.000001) {
        return newX;
    } else {
        return conjugateGradient(A, B, newX, alpha, rambda, newD, newR, iteration + 1);
    }
}

int main() {
    Matrix A = {
        {5, 2, 0, 0},
        {2, 5, 2, 0},
        {0, 2, 5, 2},
        {0, 0, 2, 5}
    };

    Matrix B = {
        {12},
        {17},
        {14},
        {7}
    };

    Matrix X = {
        {0},
        {0},
        {0},
        {0}
    };

    Matrix D = {
        {0},
        {0},
        {0},
        {0}
    };

    double alpha = 0;
    double rambda = 0;

    Matrix iniR = findR(A, B, X);
    Matrix iniD = findD(iniR, alpha, D);

    Matrix answer = conjugateGradient(A, B, X, alpha, rambda, iniD, iniR, 1);

    cout << "Final X: ";
    for (const auto& row : answer) {
        for (double val : row) {
            cout << val << " ";
        }
        cout << endl;
    }

    return 0;
}
