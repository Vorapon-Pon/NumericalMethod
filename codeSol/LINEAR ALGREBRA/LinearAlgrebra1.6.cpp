#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;
//Cholesky Decompostion Method
void setLLT(double L[3][3], double LT[3][3], double A[3][3]);
void CholeskyDecomposition(double L[3][3], double LT[3][3], double *B, double *sol);
void print(double arr[3][3]);

int main() {
    /*
                T
    [A] = [L][L]

    [A] is Symmetric Matrix

              [A]                   [L]                 [L]
        [a11  a12  a13]       [L11   0    0 ]     [L11  L21  L31]
        [a21  a22  a23]   =   [L21  L22   0 ]  x  [ 0   L22  L32]   
        [a31  a32  a33]       [L31  L32  L33]     [ 0    0   L33]

    same as LU Decomposition


    [L]{Y} = {B}
       T
    [L]{X} = {Y}

    {Y} = Created this vector for solve the answer

    {X} = Answer;   

    Subtitution
L[0][0] = sqrt(a[0][0])     |                    0                                  |                0
----------------------------|-------------------------------------------------------|----------------------------------
L[1][0] = a[0][1] / L[0][0] | L[1][1] = sqrt(a[1][1] - pow(L[1][0], 2))             |                0
----------------------------|-------------------------------------------------------|----------------------------------
L[2][0] = a[2][0] / L[0][0] | L[2][1] = (a[1][2] - (L[1][0] * L[2][0])) / L[1][1]   |  L[2][2] = sqrt(a[2][2] - pow(L[2][0],2) - pow(L[2][1],2))

    */

    double A[3][3] = { { 4, 3, 1},
                       { 3, 5, 2},
                       { 1, 2, 6} };

    double L[3][3];
    double LT[3][3];

    double B[3] = {3125,3650,2800};
    double sol[3];

    setLLT(L,LT,A);
    cout << "Matrix L"<< endl;
    print(L);
    cout << "Matrix LT"<< endl;
    print(LT);

    CholeskyDecomposition(L,LT,B,sol);

    cout << "x = " << fixed << setprecision(2) << sol[0] << endl;
    cout << "y = " << fixed << setprecision(2) << sol[1] << endl;
    cout << "z = " << fixed << setprecision(2) << sol[2] << endl;

    return 0;
}

void setLLT(double L[3][3], double LT[3][3], double A[3][3]) {
    int row = 3;

    for(int i = 0; i < row; i++) {
        for(int j = 0; j < row; j++) {
            L[i][j] = 0;
        }
    }

    //Subtitution
    L[0][0] = sqrt(A[0][0]);

    L[1][0] = A[0][1] / L[0][0];    L[1][1] = sqrt(A[1][1] - pow(L[1][0], 2));

    L[2][0] = A[2][0] / L[0][0];    L[2][1] = (A[1][2] - (L[1][0] * L[2][0])) / L[1][1]; L[2][2] = sqrt(A[2][2] - pow(L[2][0],2) - pow(L[2][1],2));


    for(int i = 0 ; i < row; i++) {
        for(int j = 0; j < row; j++) {
            LT[i][j] = L[j][i];
        }
    }
}

void CholeskyDecomposition(double L[3][3], double LT[3][3], double *B, double *sol) {
    int row = 3;

    double Y[3];
    
    for(int i = 0; i < 3; i++) { 
        Y[i] = B[i];
        for(int j = 0; j < i; j++) {
            Y[i] -= L[i][j] * Y[j];
        }
        Y[i] /= L[i][i];
    }

    for(int k = 0; k < row; k++) {
        cout << "Y[i] = " << Y[k] << endl;
    }
    cout << endl;

    for(int i = row - 1; i >= 0; i--) {
        sol[i] = Y[i];
        for(int j = i + 1; j < row; j++) {
            sol[i] -= LT[i][j] * sol[j];
        }
        sol[i] /= LT[i][i];
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