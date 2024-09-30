#include <iostream>

using namespace std;
// carmer's rule
int det3x3(int arr[][3]);
int CramersRule(int arr[][3], int *B ,int colA);

int main() {

/*
    [-2   3   1   9]
A = [ 3   4  -5   0]
    [ 1  -2   1  -4]

                                
         |a  b  c| a  b            
det(A) = |d  e  f| d  e  = ((a * e * i) + (b * f * g) + (c * d * h)) + (-(g * e * c) - (h * f * a) - (i * d * b));
         |g  h  i| g  h
         
    ---- Input A ----
    int A[3][4];
    int Row,Col;
    cin >> "Row : " >> Row >> "Col : " >> Col;
    
    for(int i = 0; i < Row; i++) {
        for(int j = 0; j < Col; j++) {
           cin >> A[i][j] ;
        }
    }
    ----------------
*/
    int A[3][3] = { {3  , 1 ,  1},
                    { 2  , 2 , 5},
                    { 1  ,-3 ,  -4} };
    
    int B[3] = {3,-1,2};
   
    int detA = det3x3(A);
    cout << "detA = " << detA << endl;

    if(detA == 0) {
        cout << "det(A) is equal to 0" << endl;
        return -1;
    }

    int x,y,z;

    x = CramersRule(A, B, 1) / detA;
    cout << "det (A1) : " << CramersRule(A, B, 1) << endl;
    y = CramersRule(A, B, 2) / detA;
    cout << "det (A2) : " << CramersRule(A, B, 2) << endl;
    z = CramersRule(A, B, 3) / detA;
    cout << "det (A3) : " << CramersRule(A, B, 3) << endl;

    cout << "x : " << x << endl;
    cout << "y : " << y << endl;
    cout << "z : " << z << endl;
 
    return 0;
}

int CramersRule(int arr[][3], int *B, int colA) {
    int temp[3][3];

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            if (j == colA - 1) {
                temp[i][j] = B[i];
            }else {
                temp[i][j] = arr[i][j];
            }
       }
    }

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            cout << temp[i][j] << " " ;
        }
        cout << endl;
    }
    cout << endl;

    return det3x3(temp);
}

int det3x3(int arr[3][3]) {
    int a = arr[0][0], b = arr[0][1], c = arr[0][2],
        d = arr[1][0], e = arr[1][1], f = arr[1][2],
        g = arr[2][0], h = arr[2][1], i = arr[2][2]; 
        
    return ((a * e * i) + (b * f * g) + (c * d * h)) + (- (g * e * c) - (h * f * a) - (i * d * b));
}