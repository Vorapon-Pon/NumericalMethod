#include <iostream>
#include <iomanip>

using namespace std;
// LU Decomposition Method
void setLU(double L[3][3], double U[3][3], double A[3][3]);
void LUDecomposition(double L[3][3], double U[3][3], double *B, double *sol);
void print(double arr[3][3]);

int main() {
    /*
        A x  =  B

        [A] = [L][U]

              [A]                   [L]               [U]
        [a11  a12  a13]       [L11   0    0 ]     [1  U12  U13]
        [a21  a22  a23]   =   [L21  L22   0 ]  x  [0   1   U23]   
        [a31  a32  a33]       [L31  L32  L33]     [0   0    1 ]

        [L]{Y} = {B}

        [U]{X} = {Y}

        {Y} = Created this vector for solve the answer

        {X} = Answer;


        //Subtitution
L[0][0] = a[0][0] | U[0][1] = a[0][1]  / L[0][0]            | U[0][2]  =  a[0][2]  / L[0][0]
------------------|-----------------------------------------|-----------------------------------------------------
L[1][0] = a[1][0] | L[1][1] = a[1][1] - (L[1][0] * U[0][1]) | U[1][2]  =  (a[1][2] - (L[1][0] * U[0][2])) / L[1][1]
------------------|-----------------------------------------|-----------------------------------------------------
L[2][0] = a[2][0] | L[2][1] = a[2][1] - (L[2][0] * U[0][1]) | L[2][2]  = (a[2][2] - (L[2][0] * U[0][2]) - (L[2][1] * U[1][2]))


    double L[3][3] = { {0, 0, 0},
                       {0, 0, 0},
                       {0, 0, 0} };

    double U[3][3] = { {0, 0, 0},
                       {0, 0, 0},
                       {0, 0, 0} }; 

        Y           X
     -4.5000       -1
      1.5882        2
      1.0000        1

    for (int j = 0; j < n; ++j) { work
        if (j == 0) {
            temp[0][j] = A[0][j];
        } else {
            temp[0][j] = A[0][j] / temp[0][0];
        }
    }

    for (int i = 1; i < row; ++i) {
        for (int j = 0; j < row; ++j) {
            if (j == 0) {
                temp[i][j] = A[i][j];
            } else if (j == 1) {
                temp[i][j] = A[i][j] - (temp[i][0] * temp[0][j]); couldnt find temp[1][2]
            } else {
                temp[i][j] = (A[i][j] - (temp[i][0] * temp[0][j]) - (temp[i][1] * temp[1][j]));
            }
        }
    }   

    Matrix L
    -2.0000 0.0000 0.0000
    3.0000 8.5000 0.0000
    1.0000 -0.5000 1.2941

    Matrix U
    1.0000 -1.5000 -0.5000
    0.0000 1.0000 -0.4118
    0.0000 0.0000 1.0000
    */

    double A[3][3] = { {5,  3, 1},
                       { 3,  4.5,3},
                       { 1, 3, 5} };

    double B[3] = {11,24,19};
    double sol[3];
    double L[3][3];
    double U[3][3];

    setLU(L,U,A);
    cout << "Matrix L" << endl;
    print(L);

    cout << "Matrix U" << endl;
    print(U);

    LUDecomposition(L,U,B,sol);    
    cout << "x = " << fixed << setprecision(2) << sol[0] << endl;
    cout << "y = " << fixed << setprecision(2) << sol[1] << endl;
    cout << "z = " << fixed << setprecision(2) << sol[2] << endl;              

    return 0;
}

void setLU(double L[3][3], double U[3][3], double A[3][3]) {
    int row = 3;
    double temp[3][3];

    for (int i = 0; i < row; i++) {
        for (int j = 0; j < row; j++) {
            temp[i][j] = 0;
        }
    }

    //Subtitution
    temp[0][0] = A[0][0];   temp[0][1] = A[0][1] / temp[0][0];                  temp[0][2] = A[0][2] / temp[0][0];   
    
    temp[1][0] = A[1][0];   temp[1][1] = A[1][1] - (temp[1][0] * temp[0][1]);   temp[1][2] = (A[1][2] - (temp[1][0] * temp[0][2])) / temp[1][1];
    
    temp[2][0] = A[2][0];   temp[2][1] = A[2][1] - (temp[2][0] * temp[0][1]);   temp[2][2]  = A[2][2] - (temp[2][0] * temp[0][2]) - (temp[2][1] * temp[1][2]);

    for (int i = 0; i < row; i++) {
        for (int j = 0; j < row; j++) {
            if (i == j) {
                U[i][j] = 1.0;
            } else {
                U[i][j] = 0.0;
            }
            L[i][j] = 0.0;
        }
    }

    for (int i = row - 1; i >= 0; i--) {
        for(int j = i; j >= 0; j--) {
            L[i][j] = temp[i][j];
        }
    }

    for(int i = 0; i < row; i++ ) {
        for(int j = i + 1; j < row; j++) {
            U[i][j] = temp[i][j];
        }
    }
}

void LUDecomposition(double L[3][3], double U[3][3], double *B, double *sol) {
    int row = 3;

    double Y[3];
    
    for(int i = 0; i < 3; i++) { // 9 0 -4 
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
            sol[i] -= U[i][j] * sol[j];
        }
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