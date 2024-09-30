#include <iostream>
#include <iomanip>
#include <cmath>
//one point iteration
using namespace std; 
//x i+1 = 7 / x i --> x = (x+7/x)/2
double function(double x) {
    return (log(8) + x) / 2;
}

double error(double x_old ,double x_new) {
    return fabs((x_new - x_old) / x_new);
}

int main() {
    double x = 1;
    double x_new = 0;
    double err = 1;
    double tolerance = 0.0000001;

    while(err > tolerance) {
        cout << "Xi :" << fixed << setprecision(10) << x << endl;
        x_new = function(x);
        cout << "Xi+1 :" << fixed << setprecision(10) << x_new << endl << endl;
        err = error(x,x_new);

        x = x_new;
    }

    cout << "x is "<< fixed << setprecision(8) << x <<endl;

    return 0;
}