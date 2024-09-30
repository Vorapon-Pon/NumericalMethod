#include <iostream>
#include <cmath>
#include <iomanip>

using namespace std;
//Bisection Method
double bisection(double xl, double xr, int x, int n, double tolerance);
double function(double value, int n, int x);

int main() { //3 ให้นักเรียนเขียนโปรแกมการถอดรากที่ n ของจำนวนเต็ม x, (√x)nโดยใช้วิธี Bisection
    int x,n;
    cout << "integer : ";
    cin >> x;
    cout << "root : " ;
    cin >> n;

    double xl, xr;
    cout << "assign interval X X : ";
    cin >> xl >> xr;

    double tolerance = 0.00001;

    double root = bisection(xl, xr, x, n, tolerance);
   
    cout << "root is " << fixed << setprecision(4) << root << endl;

    return 0;
}

double bisection(double xl, double xr, int x, int n, double tolerance) {
    double xm;
  
    while ((xr - xl) / 2 > tolerance) {
        xm = (xl + xr) / 2;

        if (function(xm, n, x) == 0.0) {
            break;
        } else if (function(xm, n, x) * function(xr, n, x) < 0) {
            xl = xm;
        } else {
            xr = xm;
        }
       
    }

    return xm;
}

double function(double value, int n, int x){
    return pow(value,n) - x;
}