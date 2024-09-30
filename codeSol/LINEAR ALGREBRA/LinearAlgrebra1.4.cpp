#include <iostream>
#include <iomanip>

using namespace std;
//Matrix Inversion Method
void GaussElimination(double arr[3][3], double inverse[3][3]);
void GaussJordanElimination(double arr[3][3], double inverse[3][3]);
void inverseMUL(double arr[3][3] , double *B);
void print(double arr[3][3]);

int main() {
    /*
       -1           [1  0  0] 
    A A   =  I  =   [0  1  0]  identity Matrix
                    [0  0  1]          

    A x = B

       -1        -1
    A A  x  = B A

            -1
    I x =  A   B

         -1
    x = A   B
    
    double A[3][3] = { {-2  , 3 ,  1},
                       { 3  , 4 , -5},      Matrix A;
                       { 1  ,-2 ,  1} };

    double B[3] = {9 ,0 ,4};                Matrix B;


    double  A[3][4] = { {-2  , 3 ,  1,  9},
                        { 3  , 4 , -5,  0},   Augment Matrix A;
                        { 1  ,-2 ,  1, -4} };


    A Inverse 
    0.2727 0.2273 0.8636
    0.3636 0.1364 0.3182
    0.4545 0.0455 0.7727

    */        
    double A[3][3] = { {-2, 3, 1},
                       { 3, 4, -5},
                       { 1, -2, 1} };

    double I[3][3] = { {1, 0, 0},
                       {0, 1, 0},
                       {0, 0, 1} };

    double B[3] = {9,0,-4};


    GaussElimination(A, I);
    cout << "I after Gauss Elimination " << endl;
    print(I);

    GaussJordanElimination(A, I);
    cout << "I after Gauss-Jordan Elimination " << endl;
    print(I);
    print(A);

    inverseMUL(I,B);

    cout << "x = " << fixed << setprecision(2) << B[0] << endl;
    cout << "y = " << fixed << setprecision(2) << B[1] << endl;
    cout << "z = " << fixed << setprecision(2) << B[2] << endl;

    return 0;
}

void GaussElimination(double arr[3][3], double inverse[3][3]) {
    int row = 3;
    
    for (int i = 0; i < row ; i++) {
        for (int j = i + 1; j < row; j++) {
            double temp = arr[j][i] / arr[i][i];
            for(int k = i; k < row; k++) {
                arr[j][k] -= temp * arr[i][k];
            }
            for(int k = 0; k < row; k++) {
                inverse[j][k] -= temp * inverse[i][k];
            }
            print(inverse);
        }
    }
}

void GaussJordanElimination(double arr[3][3], double inverse[3][3]) {
    int row = 3;

    for(int i = row - 1; i >= 0; i--) {
        double diagonal = arr[i][i];
        for(int j = 0; j < row; j++) {
            arr[i][j] /= diagonal;
            inverse[i][j] /= diagonal;
        }
        print(inverse);

        for(int k = i - 1; k >= 0; k--) {
            double temp = arr[k][i];
            for (int j = row; j >= 0; j--) {
                arr[k][j] -= temp * arr[i][j];
            }

            for (int j = row - 1; j >= 0; j--) {
                inverse[k][j] -= temp * inverse[i][j];
            }
            print(inverse);
        }
    }
}

void inverseMUL(double I[3][3], double *B) {
    int row = 3;
    double result[3] = {0, 0, 0}; 

    for(int i = 0; i < row; i++) {
        for(int j = 0; j < row; j++) {
            result[i] += I[i][j] * B[j];
        }
    }

    for(int i = 0; i < row; i++) {
        B[i] = result[i];
    }
}

void print(double arr[3][3]) {
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 3; j++) {
            cout << fixed << setprecision(4) << arr[i][j]  << " ";
        }
        cout << endl;
    }
    cout << endl;
}