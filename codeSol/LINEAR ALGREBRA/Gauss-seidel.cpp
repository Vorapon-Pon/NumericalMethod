#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;

void gaussSeidelIteration(double A[][4], double B[], double x[], int dimension ,int *iter ,double tolerance);
double error(double x_new , double x_old);

int main() {
    
    double A[4][4] = {{5,2,0,0},
                      {2,5,2,0},
                      {0,2,5,2},
                      {0,0,2,5}};

    double B[4] = {12,17,14,7};  
    double x[4] = {0, 0, 0, 0};     

    int dimension = 4;
    double tolerance = 1e-6;
    int iteration = 0;

    gaussSeidelIteration(A, B, x, dimension, &iteration, tolerance);

    cout << "iteration : " << iteration << " for " << tolerance <<endl;
    for(int i = 0; i < dimension; i++) {
        cout << "x" << i + 1 << " " << fixed << setprecision(6) << x[i] << endl;
    }


    return 0;
}

void gaussSeidelIteration(double A[][4], double B[], double x[], int dimension ,int *iter ,double tolerance) {
    double x_old[4]; 
    double errx[4];  

    for(int i = 0; i < dimension; i++) {
        x_old[i] = x[i];
        errx[i] = 1;  
    }
    
    while((errx[0] >= tolerance) || (errx[1] >= tolerance) || (errx[2] >= tolerance) ||  (errx[3] >= tolerance)) {
        for(int i = 0; i < dimension; i++) {
            double sum = 0;
            for(int j = 0; j < dimension; j++) {
                if(i != j) {
                    sum += A[i][j] * x_old[j];
                }
            }
            x[i] = (B[i] - sum) / A[i][i];
            errx[i] = error(x[i], x_old[i]);
            x_old[i] = x[i];                 
        }
        
        (*iter)++;
        cout << "iter " << *iter << "  x1= " << x[0] << " x2= " << x[1] << " x3= " << x[2] << " x4= " << x[3] << endl;
        cout << "e1= " << errx[0] << " e2= " << errx[1] << " e3= " << errx[2] << " e4= " << errx[3] << endl << endl;

    }
}

double error(double x_new , double x_old) {
    return fabs((x_new - x_old) / x_new) ;
}