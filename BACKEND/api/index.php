<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Tuupola\Middleware\JwtAuthentication as JwtAuthentication;
use \Firebase\JWT\JWT;
require '../vendor/autoload.php';

const JWT_MDP = "voicilemdpduJWT";

$app = AppFactory::create();

$app->add(new JwtAuthentication([
    "attribute" => "token",
    "header" => "Authorization",
    "regexp" => "/Bearer\s+(.*)$/i",
    "secure" => false,
    "algorithm" => ["HS256"],
    "secret" => JWT_MDP,

    "path" => ["/api"],
    "ignore" => ["/api/hello", "/api/auth", "/api/login", "/api/createUser"],
    "error" => function ($response, $arguments) {
        $data = array('ERREUR' => 'Connexion', 'ERREUR' => 'JWT Non valide');
        $response = $response->withStatus(401);
        return $response->withHeader("Content-Type", "application/json")->getBody()->write(json_encode($data));
    }
]));

$app->get('/api/hello/{login}', function (Request $request, Response $response, $args) {
    $response->getBody()->write($args['login']);
    return $response;
    });

$app->get('/api/auth/{prenom}', function (Request $request, Response $response, $args) {
    $token_jwt = Generer_Token_JWT(0, "email@gmail.com", $args["prenom"]);
    return $response->withHeader("Authorization", "Bearer { $token_jwt }");
});

$app->post('/api/login', function (Request $request, Response $response, $args) {
    $body = $request->getParsedBody();
    $prenom = $body['prenom'];
    $motdepasse = $body['motdepasse'];

    $response = ajoutHeadersCors($response);
    $token_jwt = Generer_Token_JWT(0, "email@gmail.com", $prenom);
    $response = $response->withHeader("Authorization", "Bearer { $token_jwt }");

    return $response;
    });

    function ajoutHeadersCors($response) {
        $response = $response->withHeader("Content-Type", "application/json")
            ->withHeader("Access-Control-Allow-Origin", "http://localhost:4200")
            ->withHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
            ->withHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
            ->withHeader("Access-Control-Expose-Headers", "Authorization");
        
        return $response;
    }

    function Generer_Token_JWT(string $userid, string $email, string $prenom)
    {
        $issuedAt = time();
        $expirationTime = $issuedAt + 600;
        $payload = array(
            'userid' => $userid,
            'email' => $email,
            'prenom' => $prenom,
            'iat' => $issuedAt,
            'exp' => $expirationTime
        );
        $token_jwt = JWT::encode($payload, JWT_MDP, "HS256");
        return $token_jwt;
    }

// Run app
$app->run();

?>