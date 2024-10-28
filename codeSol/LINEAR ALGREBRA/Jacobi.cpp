#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;

void jacobiIteration(double** A, double* B, double* x, int dimension, int* iter, double tolerance);
double error(double x_new, double x_old);

int main() {
    int dimension;
    cout << "Enter the dimension of the matrix: ";
    cin >> dimension;

    // Dynamically allocate memory for A, B, and x based on user-defined dimension
    double** A = new double*[dimension];
    for (int i = 0; i < dimension; i++) {
        A[i] = new double[dimension];
    }
    double* B = new double[dimension];
    double* x = new double[dimension];

    cout << "Enter elements of matrix A (row by row):\n";
    for (int i = 0; i < dimension; i++) {
        for (int j = 0; j < dimension; j++) {
            cin >> A[i][j];
        }
    }

    cout << "Enter elements of matrix B:\n";
    for (int i = 0; i < dimension; i++) {
        cin >> B[i];
    }

    cout << "Enter initial guess for x:\n";
    for (int i = 0; i < dimension; i++) {
        cin >> x[i];
    }

    double tolerance = 1e-6;
    int iteration = 0;

    jacobiIteration(A, B, x, dimension, &iteration, tolerance);

    cout << "Total iterations: " << iteration << " for tolerance: " << tolerance << endl;
    for (int i = 0; i < dimension; i++) {
        cout << "x" << i + 1 << " = " << fixed << setprecision(6) << x[i] << endl;
    }

    // Free allocated memory
    for (int i = 0; i < dimension; i++) {
        delete[] A[i];
    }
    delete[] A;
    delete[] B;
    delete[] x;

    return 0;
}

void jacobiIteration(double** A, double* B, double* x, int dimension, int* iter, double tolerance) {
    double* x_old = new double[dimension];
    double* errx = new double[dimension];

    for (int i = 0; i < dimension; i++) {
        x_old[i] = x[i];
        errx[i] = 1;
    }

    bool continueIterating = true;
    while (continueIterating) {
        for (int i = 0; i < dimension; i++) {
            double sum = 0;
            for (int j = 0; j < dimension; j++) {
                if (i != j) {
                    sum += A[i][j] * x_old[j];
                }
            }
            x[i] = (B[i] - sum) / A[i][i];
        }

        continueIterating = false;
        for (int i = 0; i < dimension; i++) {
            errx[i] = error(x[i], x_old[i]);
            if (errx[i] >= tolerance) {
                continueIterating = true;
            }
            x_old[i] = x[i];
        }

        (*iter)++;
        cout << "Iteration " << *iter << ": ";
        for (int i = 0; i < dimension; i++) {
            cout << "x" << i + 1 << "= " << x[i] << " ";
        }
        cout << endl;

        cout << "Errors: ";
        for (int i = 0; i < dimension; i++) {
            cout << "e" << i + 1 << "= " << errx[i] << " ";
        }
        cout << endl << endl;
    }

    delete[] x_old;
    delete[] errx;
}

double error(double x_new, double x_old) {
    return fabs((x_new - x_old) / x_new);
}


/*
double A[4][4] = {{5,2,0,0},
                      {2,5,2,0},
                      {0,2,5,2},
                      {0,0,2,5}};

    double B[4] = {12,17,14,7};  
    double x[4] = {0, 0, 0, 0};     

    int dimension = 4;
    double tolerance = 1e-6;
    int iteration = 0;
*/