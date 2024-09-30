#include <iostream>
#include <iomanip>

using namespace std;
//Gauss Elimination Method
void GaussElimination(double arr[3][4]);
void BackSubtitution(double arr[3][4]);
void print(double arr[3][4]);

int main() {
    /*                               ___
                        [a  b  c]   |   |
    row echelon Form =  [0  e  f]  |\\  |
                        [0  0  i]  |_\\_|


                       |a  b  c|  -> ([a,b,c, x] * d)/a  -  [d,e,f, y]
    Eliminate by Row = |d  e  f|  -> ([e,f, y] * h) /e   -  [h,i,   z]
                       |g  h  i|  


    ---- Input A ----
    int A[3][4];
    int Row,Col;
    cin >> "Row : " >> Row >> "Col : " >> Col;
    
    for(int i = 0; i < Row; i++) {
        for(int j = 0; j < Col; j++) {
            cout << "enter A " << i << " " << j << ": ";
            cin >> A[i][j] ;
        }
    }
    ----------------
    */         
    double  A[3][4] = { {3  , 1 ,  1, 3},
                        { 2  , 2 , 5, -1},
                        { 1  ,-3 ,  -4, 2} };

    GaussElimination(A);
    print(A);

    BackSubtitution(A);

    cout << "x = " << fixed << setprecision(2) << A[0][3] << endl;
    cout << "y = " << fixed << setprecision(2) << A[1][3] << endl;
    cout << "z = " << fixed << setprecision(2) << A[2][3] << endl;

    return 0;
}

void GaussElimination(double arr[3][4]) {
    int row = 3;
    int col = 4;

    for (int i = 0; i < row - 1; i++) {
        for(int j = i + 1; j < row; j++) {
            double temp = arr[j][i] / arr[i][i];
            for(int k = i; k < col; k++) {
                arr[j][k] -= temp * arr[i][k];
            }
            print(arr);
        }
    }
}

void BackSubtitution(double arr[3][4]) {
    arr[2][3] = arr[2][3] / arr[2][2];
    arr[1][3] = (arr[1][3] - (arr[1][2] * arr[2][3])) / arr[1][1];
    arr[0][3] = (arr[0][3] - (arr[0][2] * arr[2][3]) - (arr[0][1] * arr[1][3])) / arr[0][0];
}

void print(double arr[3][4]) {
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 4; j++) {
            cout << fixed << setprecision(1) << arr[i][j]  << " ";
        }
        cout << endl;
    }
    cout << endl;
}